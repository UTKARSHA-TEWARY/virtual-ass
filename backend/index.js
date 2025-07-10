import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import connectdb from "./config/db.js";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const port = 8000;

// ✅ Middlewares
app.use(express.json());

// ✅ CORS config (allow frontend to access API with credentials)
app.use(
  cors({
    origin: "http://localhost:5173", // your frontend
    credentials: true,              // allow cookies, tokens
  })
);

// ✅ Cookie parser must be used like a function
app.use(cookieParser());

// ✅ Routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

// ✅ DB & Server start
app.listen(port, () => {
  connectdb(); // should be async if not already
  console.log(`Server started on http://localhost:${port}`);
});
