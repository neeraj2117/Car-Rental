import express from "express";
import {
  checkAvailabilityOfCar,
  createBooking,
  getUserBookings,
  getOwnerBookings,
  changeBookingStatus,
} from "../controllers/bookingController.js";
import { protect } from "../middlewares/auth.js";
import Booking from "../models/Booking.js";

const bookingRouter = express.Router();

bookingRouter.post("/check-availability", checkAvailabilityOfCar);
bookingRouter.post("/create", protect, createBooking);
bookingRouter.get("/user", protect, getUserBookings);
bookingRouter.get("/owner", protect, getOwnerBookings);
bookingRouter.post("/change-status", protect, changeBookingStatus);


// Get all booked dates for a specific car
bookingRouter.get("/car-booked-dates/:carId", async (req, res) => {
  try {
    const { carId } = req.params;

    // Find all bookings that are either pending or confirmed
    const bookings = await Booking.find({ 
      car: carId, 
      status: { $in: ["pending", "confirmed"] } 
    });

    // Convert bookings to array of booked timestamps
    const bookedDates = [];
    bookings.forEach((booking) => {
      const start = new Date(booking.pickupDate);
      const end = new Date(booking.returnDate);

      let current = new Date(start);
      current.setHours(0, 0, 0, 0); // normalize to midnight
      const endDate = new Date(end);
      endDate.setHours(0, 0, 0, 0);

      while (current <= endDate) {
        bookedDates.push(current.getTime());
        current.setDate(current.getDate() + 1);
      }
    });

    res.status(200).json({ bookedDates });
  } catch (error) {
    console.error("Error fetching booked dates:", error);
    res.status(500).json({ message: "Failed to fetch booked dates" });
  }
});
;


export default bookingRouter;
