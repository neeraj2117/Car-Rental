import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    // VERIFY the token and get payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "defaultsecret");
    // decoded = { id: "userId", iat: ..., exp: ... }

    // Find user by id
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized, user not found" });
    }

    next();
  } catch (error) {
    console.error("Protect error:", error);
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};

