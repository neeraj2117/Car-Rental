import express from "express";
import { changeRoleToOwner, addCar ,getOwnerCars, deleteCar, toggleCarAvailability, getDashboardData, updateUserImage } from "../controllers/ownerController.js";
import { protect } from "../middlewares/auth.js";
import upload from '../middlewares/multer.js';

const ownerRouter = express.Router();

ownerRouter.post("/change-role", protect, changeRoleToOwner);
ownerRouter.post("/add-car", protect, upload.single("image"), addCar);
ownerRouter.get("/cars", protect, getOwnerCars);
ownerRouter.post("/toggle-car", protect, toggleCarAvailability);
ownerRouter.post("/delete-car", protect, deleteCar);
ownerRouter.get("/dashboard", protect, getDashboardData);
ownerRouter.post("/update-image", protect, upload.single("image"), updateUserImage);

export default ownerRouter;
