import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: "dflgpx5i6",
  api_key: "785956149797932",
  api_secret: "ARYOmxL0cEc05dMdGxVEbMLvtZk",
});

export const uploadOnCloudinary = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "assistant-images",
    });
    fs.unlinkSync(filePath);
    return result.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    return null;
  }
};
