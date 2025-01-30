import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "profile_pictures",
    format: "png",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
    transformation: [
      { width: 500, height: 500, crop: "limit", quality: "auto" },
      {fetch_format: "webp"}
    ],
  }),
});

const upload = multer({ storage, limits: { fileSize: 1*1024*1024} });

export default upload;
