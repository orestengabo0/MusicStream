import express from "express"
import upload from "../cloudinary/audioStorageConfig"
import { createSong, deleteSong } from "../controllers/songController"
import { authenticate } from "../config/authMiddleware"

const songRoute = express.Router()

songRoute.post("/upload", authenticate, upload.single("songs") , createSong)
songRoute.delete("/delete/:songId", authenticate, deleteSong)

export default songRoute