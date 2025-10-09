import Booking from "../models/Booking.js";
import Car from "../models/Car.js";

export const checkAvailability = async (car, pickupDate, returnDate) => {
  const bookings = await Booking.find({
    car,
    pickupDate: { $lte: returnDate },
    returnDate: { $gte: pickupDate },
  });

  return bookings.length === 0;
};

export const checkAvailabilityOfCar = async (req, res) => {
  try {
    const { location, pickupDate, returnDate } = req.body;

    // fetch all car for given location
    const cars = await Car.find({ location, isAvailable: true });

    // fetch all car for given range date's
    const availableCarsPromises = cars.map(async (car) => {
      const available = await checkAvailability(
        car._id,
        pickupDate,
        returnDate
      );
      return { ...car._doc, isAvailable: available };
    });

    let availableCars = await Promise.all(availableCarsPromises);
    availableCars = availableCars.filter((car) => car.isAvailable === true);

    res.json({
      success: true,
      availableCars,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// export const createBooking = async (req, res) => {
//   try {
//     const { _id } = req.user;
//     const { car, pickupDate, returnDate } = req.body;

//     if (!car || !pickupDate || !returnDate) {
//       return res
//         .status(400)
//         .json({ message: "Car, start date, and end date are required" });
//     }

//     const isAvailable = await checkAvailability(car, pickupDate, returnDate);
//     if (!isAvailable) {
//       return res.json({
//         success: false,
//         message: "Car is not available for booking",
//       });
//     }

//     const carData = await Car.findById(car);

//     if (!carData) {
//       return res.status(404).json({ message: "Car not found" });
//     }

//     if (!carData.owner) {
//       return res.status(400).json({ message: "Car does not have an owner assigned" });
//     }

//     // Convert dates to Date objects
//     const start = new Date(pickupDate);
//     const end = new Date(returnDate);

//     if (end < start) {
//       return res
//         .status(400)
//         .json({ message: "End date cannot be before start date" });
//     }

//     // Calculate total price
//     const noOfDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
//     const price = noOfDays * carData.pricePerDay;

//     // Create booking
//     const booking = await Booking.create({
//       car: car._id,
//       user: _id,
//       owner: carData.owner,
//       pickupDate,
//       returnDate,
//       price,
//       paymentStatus: "pending",
//     });

//     res.status(201).json({
//       success: true,
//       message: "Car booked successfully",
//       booking,
//     });
//   } catch (error) {
//     console.error("Book car error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

export const createBooking = async (req, res) => {
  try {
    const { _id } = req.user; // logged-in user
    const { car, pickupDate, returnDate } = req.body;

    // ✅ Validate input
    if (!car || !pickupDate || !returnDate) {
      return res.status(400).json({
        success: false,
        message: "Car, pickup date, and return date are required",
      });
    }

    // ✅ Check if the car exists
    const carData = await Car.findById(car);
    if (!carData) {
      return res.status(404).json({
        success: false,
        message: "Car not found",
      });
    }

    // ✅ Ensure the car has an owner
    if (!carData.owner) {
      return res.status(400).json({
        success: false,
        message: "Car does not have an owner assigned",
      });
    }

    // ✅ Convert dates and validate range
    const start = new Date(pickupDate);
    const end = new Date(returnDate);
    if (end < start) {
      return res.status(400).json({
        success: false,
        message: "Return date cannot be before pickup date",
      });
    }

    // ✅ Check availability
    const isAvailable = await checkAvailability(carData._id, start, end);
    if (!isAvailable) {
      return res.status(400).json({
        success: false,
        message: "Car is not available for the selected dates",
      });
    }

    // ✅ Calculate total price
    const noOfDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) || 1;
    const price = noOfDays * carData.pricePerDay;

    // ✅ Create booking
    const booking = await Booking.create({
      car: carData._id,
      user: _id,
      owner: carData.owner,
      pickupDate: start,
      returnDate: end,
      price,
      paymentStatus: "pending",
      status: "pending", // default status
    });

    // ✅ Return success
    res.status(201).json({
      success: true,
      message: "Car booked successfully",
      booking,
    });
  } catch (error) {
    console.error("Book car error:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
      error: error.message,
    });
  }
};

export const getUserBookings = async (req, res) => {
  try {
    const { _id } = req.user;

    const bookings = await Booking.find({ user: _id })
      .populate("car", "brand model image category pricePerDay location") // include car info
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      bookings,
    });
  } catch (error) {
    console.error("Get user bookings error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getOwnerBookings = async (req, res) => {
  try {
    if (req.user.role !== "owner") {
      return res.json({ success: false, message: "Not authorized" });
    }

    const bookings = await Booking.find({ owner: req.user._id })
      .populate("car user")
      .select("-user.password")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      bookings,
    });
  } catch (error) {
    console.error("Get owner bookings error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const changeBookingStatus = async (req, res) => {
  try {
    const { _id } = req.user;
    const {bookingId, status} = req.body;    

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Validate status
    const validStatuses = ["pending", "confirmed", "cancelled", "completed"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid booking status" });
    }

    // Optionally, check if the logged-in user is the owner of the car
    if (booking.owner.toString() !== _id.toString()) {
      return res.status(403).json({success: false, message: "Not authorized to update this booking" });
    }

    booking.status = status;
    await booking.save();

    res.json({
      success: true,
      message: `Booking status updated to ${status}`,
      booking,
    });
  } catch (error) {
    console.error("Update booking status error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
