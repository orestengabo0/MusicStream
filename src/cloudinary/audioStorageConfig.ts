import multer from "multer"
import { CloudinaryStorage } from "multer-storage-cloudinary"
import cloudinary from "./cloudinary"

const storage = new CloudinaryStorage({
    cloudinary,
    params: async(req, file) => ({
        folder: "songs",
        resource_type: "auto",
        allowed_formats: ["mp3","aac","ogg","wav"],
    })
})

const upload = multer({storage})

export default upload