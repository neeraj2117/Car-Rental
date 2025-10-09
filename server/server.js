import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import connectDB from "./config/db.js";
import userRouter from "./routes/userRoutes.js";
import ownerRouter from "./routes/ownerRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";

dotenv.config();
const app = express();

await connectDB();

app.use(express.json());
app.use(cors());

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/car_rental";
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected"))
.catch((err) => console.error("❌ MongoDB connection error:", err));


app.use("/api/user/", userRouter);
app.use("/api/owner/", ownerRouter);
app.use("/api/bookings/", bookingRouter);

app.get("/", (req, res) => {
  res.send("Car Rental API is running");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port http://localhost:${PORT}`));


