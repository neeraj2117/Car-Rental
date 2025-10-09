import express from "express";
import { registerUser, loginUser, logoutUser, getUserData, getCars } from "../controllers/userController.js";
import { protect } from "../middlewares/auth.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/logout", logoutUser);
userRouter.get("/data", protect, getUserData);
userRouter.get("/cars", getCars);

export default userRouter;
