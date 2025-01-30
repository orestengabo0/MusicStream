import express from "express"
import upload from "../cloudinary/audioStorageConfig"
import { createSong } from "../controllers/songController"
import { authenticate } from "../config/authMiddleware"

const songRoute = express.Router()

songRoute.post("/upload", authenticate, upload.single("song") , createSong)

export default songRoute