import User from "../models/User.js";
import fs from "fs";
import imagekit from "../config/imagekit.js";
import Car from "../models/Car.js";
import Booking from "../models/Booking.js";

export const changeRoleToOwner = async (req, res) => {
  try {
    const { _id } = req.user;
    if (!req.user) {
      return res.status(403).json({ message: "Admin access required" });
    }

    const user = await User.findByIdAndUpdate(_id, { role: "owner" });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      success: true,
      message: `Now you can list cars and manage bookings`,
    });
  } catch (error) {
    console.error("Change role error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const addCar = async (req, res) => {
  try {
    const { _id } = req.user;
    if (!req.file) {
      return res.status(400).json({ message: "Image file is required" });
    }

    const car = JSON.parse(req.body.carData);

    // Upload directly from buffer
    const response = await imagekit.upload({
      file: req.file.buffer,
      fileName: req.file.originalname,
      folder: "/cars",
    });

    const optimizedImageUrl = imagekit.url({
      path: response.filePath,
      transformation: [
        { width: "1280" },
        { quality: "auto" },
        { format: "webp" },
      ],
    });

    const newCar = await Car.create({
      ...car,
      owner: _id,
      image: optimizedImageUrl,
    });

    res.json({
      success: true,
      message: "Car added successfully",
      car: newCar,
    });
  } catch (error) {
    console.error("Add car error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getOwnerCars = async (req, res) => {
  try {
    const { _id } = req.user;

    // Find all cars where owner matches the logged-in user
    const cars = await Car.find({ owner: _id }).sort({ createdAt: -1 });

    res.json({
      success: true,
      cars,
    });
  } catch (error) {
    console.error("Get owner cars error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const toggleCarAvailability = async (req, res) => {
  try {
    const { _id } = req.user;
    const { carId } = req.body;

    // Find the car and ensure it belongs to the logged-in owner
    const car = await Car.findById(carId);
    if (!car) {
      return res
        .status(404)
        .json({ message: "Car not found or you don't own it" });
    }

    if (car.owner.toString() !== _id.toString()) {
      return res.json({ success: false, message: "Unauthorized" });
    }

    // Toggle availability
    car.isAvailable = !car.isAvailable;
    await car.save();

    res.json({
      success: true,
      message: `Car is now ${car.isAvailable ? "available" : "unavailable"}`,
      car,
    });
  } catch (error) {
    console.error("Toggle car availability error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteCar = async (req, res) => {
  try {
    const { _id } = req.user;
    const { carId } = req.body;

    // Find the car and ensure it belongs to the logged-in owner
    const car = await Car.findById(carId);
    if (!car) {
      return res
        .status(404)
        .json({ message: "Car not found or you don't own it" });
    }

    if (car.owner.toString() !== _id.toString()) {
      return res.json({ success: false, message: "Unauthorized" });
    }

    car.owner = null;
    car.isAvailable = false;
    await car.save();

    res.json({
      success: true,
      message: `Car removed`,
    });
  } catch (error) {
    console.error("Toggle car availability error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getDashboardData = async (req, res) => {
  try {
    const { _id, role } = req.user;

    if (role !== "owner") {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    // Fetch all cars of this owner
    const cars = await Car.find({ owner: _id }).sort({ createdAt: -1 });

    // Fetch all bookings and populate car info
    const bookings = await Booking.find()
      .populate("car")
      .sort({ createdAt: -1 });

    // Filter bookings only for owner's cars
    const ownerBookings = bookings.filter(
      (b) => b.car && b.car.owner.toString() === _id.toString()
    );

    // Separate bookings by status
    const pendingBookings = ownerBookings.filter((b) => b.status === "pending");
    const completedBookings = ownerBookings.filter(
      (b) => b.status === "completed" || b.status === "confirmed"
    );

    // Calculate monthly revenue from confirmed/completed bookings
    const monthlyRevenue = ownerBookings
      .filter((b) => b.status === "completed" || b.status === "confirmed")
      .reduce((acc, b) => acc + (b.price || 0), 0);

    // Prepare recent bookings (latest 3)
    const recentBookings = ownerBookings.slice(0, 3).map((b) => ({
      name: b.car?.brand + " " + b.car?.model || "Unknown Car",
      date: b.createdAt.toDateString(),
      price: b.price,
      status: b.status,
    }));

    // Prepare dashboard data
    const dashboardData = {
      totalCars: cars.length,
      totalBookings: ownerBookings.length,
      pendingBookings: pendingBookings.length,
      completedBookings: completedBookings.length,
      recentBookings,
      monthlyRevenue,
    };

    res.json({ success: true, dashboardData });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateUserImage = async (req, res) => {
  try {
    const { _id } = req.user;
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "Image file is required" });
    }

    // Upload the image to ImageKit
    const response = await imagekit.upload({
      file: req.file.buffer,
      fileName: req.file.originalname,
      folder: "/users",
    });

    const optimizedImageUrl = imagekit.url({
      path: response.filePath,
      transformation: [
        { width: "500" },
        { quality: "auto" },
        { format: "webp" },
      ],
    });

    // Update user's image
    const user = await User.findByIdAndUpdate(
      _id,
      { image: optimizedImageUrl },
      { new: true }
    ).select("-password");

    res.json({
      success: true,
      message: "Profile image updated successfully",
      user,
    });
  } catch (error) {
    console.error("Update user image error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
