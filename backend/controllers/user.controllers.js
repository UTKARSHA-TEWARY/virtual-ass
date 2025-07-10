import User from "../models/user.model.js";
import { uploadOnCloudinary } from "../config/cloudinary.js";
import geminiResponse from "../gemini.js";
import moment from "moment";

// ✅ GET current logged-in user
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ UPDATE user assistant name & image
export const updateUser = async (req, res) => {
  try {
    const { assistantname, imageurl } = req.body;
    let finalImage = imageurl;

    if (!assistantname) {
      return res.status(400).json({ message: "Assistant name is required" });
    }

    if (req.file) {
      const uploadedUrl = await uploadOnCloudinary(req.file.path);
      if (!uploadedUrl) throw new Error("Cloudinary upload failed");
      finalImage = uploadedUrl;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      { assistantname, assistantImage: finalImage },
      { new: true }
    ).select("-password");

    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Failed to update user:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// ✅ Assistant response handler (Gemini)
export const asktoassistant = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { assistantname: assistantName, name: userName } = user;
    const { command } = req.body;

    const gemResult = await geminiResponse(command, assistantName, userName);

    if (!gemResult || typeof gemResult !== "object") {
      return res.status(500).json({
        type: "general",
        userInput: command,
        response: "Sorry, the assistant failed to respond.",
      });
    }

    const { type, userInput, response } = gemResult;

    switch (type) {
      case "get_time":
        return res.json({ type, userInput, response: `Current time is ${moment().format("HH:mm:ss")}` });
      case "get_date":
        return res.json({ type, userInput, response: `Current date is ${moment().format("YYYY-MM-DD")}` });
      case "get-day":
        return res.json({ type, userInput, response: `Today is ${moment().format("dddd")}` });
      case "get_month":
        return res.json({ type, userInput, response: `Current month is ${moment().format("MMMM")}` });

      case "general":
      case "google_search":
      case "youtube_search":
      case "youtube_play":
      case "instagram_open":
      case "calculator_open":
      case "weather_show":
        return res.status(200).json({ type, userInput, response });

      default:
        return res.status(400).json({ message: "Invalid command type" });
    }
  } catch (error) {
    console.error("Assistant error:", error.message);
    return res.status(500).json({
      type: "general",
      userInput: req.body.command,
      response: "Sorry, something went wrong while processing your request.",
    });
  }
};


