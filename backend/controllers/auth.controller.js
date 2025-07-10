import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import genTocken from "./tocken.js";

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existemail = await User.findOne({ email });
    if (existemail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hp = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hp });

    const tocken = genTocken(user._id);

    res.cookie("tocken", tocken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const tocken = genTocken(user._id);

    res.cookie("tocken", tocken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const Logout = async (req, res) => {
  try {
    res.clearCookie("tocken");
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
