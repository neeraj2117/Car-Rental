import Booking from "../models/Booking.js";
import Car from "../models/Car.js";


export const checkAvailability = async (car, pickupDate, returnDate) => {
  // Accept either Date objects or ISO date strings
  const start = new Date(pickupDate);
  const end = new Date(returnDate);

  // Normalize to full days to avoid time-of-day issues
  const dayStart = new Date(start);
  dayStart.setHours(0, 0, 0, 0);

  const dayEnd = new Date(end);
  dayEnd.setHours(23, 59, 59, 999);

  // Find any booking that overlaps [dayStart, dayEnd]
  const bookings = await Booking.find({
    car,
    status: { $in: ["pending", "confirmed"] },
    pickupDate: { $lte: dayEnd },
    returnDate: { $gte: dayStart },
  });

  // Debug log (remove or reduce in production)
  console.log(
    `checkAvailability for car ${car}: searching overlaps with ${dayStart.toISOString()} - ${dayEnd.toISOString()}, found ${bookings.length}`
  );

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

export const createBooking = async (req, res) => {
  try {
    console.log("---- CREATE BOOKING ----");
    console.log("USER:", req.user && req.user._id);
    console.log("BODY:", req.body);

    const { _id } = req.user; // logged-in user
    const { car, pickupDate, returnDate } = req.body;

    if (!car || !pickupDate || !returnDate) {
      return res.status(400).json({
        success: false,
        message: "Car, pickup date, and return date are required",
      });
    }

    const carData = await Car.findById(car);
    if (!carData) {
      return res.status(404).json({ success: false, message: "Car not found" });
    }

    // If your business requires owner always set, keep this. Otherwise, log and handle.
    if (!carData.owner) {
      console.warn(`Car ${car} has no owner assigned`);
      return res.status(400).json({
        success: false,
        message: "Car does not have an owner assigned",
      });
    }

    const start = new Date(pickupDate);
    const end = new Date(returnDate);

    // normalize times to days
    const dayStart = new Date(start); dayStart.setHours(0,0,0,0);
    const dayEnd = new Date(end); dayEnd.setHours(23,59,59,999);

    if (dayEnd < dayStart) {
      return res.status(400).json({ success: false, message: "Return date cannot be before pickup date" });
    }

    // Check availability using normalized range
    const isAvailable = await checkAvailability(carData._id, dayStart, dayEnd);
    if (!isAvailable) {
      return res.status(400).json({
        success: false,
        message: "Selected dates are already booked",
      });
    }

    const noOfDays = Math.ceil((dayEnd - dayStart) / (1000 * 60 * 60 * 24)) || 1;
    const price = noOfDays * carData.pricePerDay;

    const booking = await Booking.create({
      car: carData._id,
      user: _id,
      owner: carData.owner,
      pickupDate: dayStart,
      returnDate: dayEnd,
      price,
      paymentStatus: "pending",
      status: "pending",
    });

    console.log("Booking created:", booking._id);
    return res.status(201).json({ success: true, message: "Car booked successfully", booking });
  } catch (error) {
    console.error("Book car error:", error);
    return res.status(500).json({ success: false, message: "Server error. Please try again later.", error: error.message });
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
