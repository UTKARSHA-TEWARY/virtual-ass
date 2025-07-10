import express from "express";
import { signup, Login, Logout } from "../controllers/auth.controller.js";

const authRouter = express.Router();

authRouter.post("/signup", signup);     // Correct ✅
authRouter.post("/signin", Login);      // Fixed typo ✅
authRouter.get("/logout", Logout);      // Correct ✅

export default authRouter;
