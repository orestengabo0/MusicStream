import express from "express"
import { authenticate } from "../config/authMiddleware"
import { addSongToAlbum, createAlbum, deleteAlbum, removeSongFromAlbum } from "../controllers/albumController"

const albumRoute = express.Router()

albumRoute.post("/create", authenticate, createAlbum)
albumRoute.delete("/delete/:id", authenticate, deleteAlbum)
albumRoute.delete("/remove", authenticate, removeSongFromAlbum)
albumRoute.post("/add", authenticate, addSongToAlbum)

export default albumRoute