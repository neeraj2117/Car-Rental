import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import Car from '../models/Car.js'

const generateToken = (userId) => {
  try {
    const payload = { id: userId };

    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
  } catch (error) {
    console.error("Token generation error:", error);
    return null;
  }
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Please fill all required fields" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const hashedpassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedpassword });

    const token = generateToken(user._id.toString());

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please enter both email and password" });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user._id.toString());

    res.json({
      success: true,
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const logoutUser = async (req, res) => {
  try {
    // If you're using cookies:
    // res.clearCookie("token");

    // For token-based auth (client deletes token)
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getUserData = async (req, res) => {
  try {
    const { user } = req;
    res.json({ success: true, user });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getCars = async (req, res) => {
  try {
    const cars = await Car.find({ isAvailable: true }).sort({ createdAt: -1 });
    res.json({ success: true, cars });
  } catch (error) {
    console.error("Get cars error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

