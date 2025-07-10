import express from "express";
import { getCurrentUser, updateUser, asktoassistant } from "../controllers/user.controllers.js";
import isAuth from "../middleware/isAuth.js";
import upload from "../middleware/multer.js";

const userRouter = express.Router();

userRouter.get("/current", isAuth, getCurrentUser);
userRouter.put("/update", isAuth, upload.single("file"), updateUser);
userRouter.post("/asktoassistant", isAuth, asktoassistant);

export default userRouter;


