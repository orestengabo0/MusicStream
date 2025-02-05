import express from "express"
import { authenticate } from "../config/authMiddleware"
import { addSongToAlbum, createAlbum, deleteAlbum, getMyAlbum, getMyAlbums, removeSongFromAlbum } from "../controllers/albumController"

const albumRoute = express.Router()

albumRoute.get("/", authenticate, getMyAlbums)
albumRoute.get("/:albumId", authenticate, getMyAlbum)
albumRoute.post("/create", authenticate, createAlbum)
albumRoute.delete("/delete/:albumId", authenticate, deleteAlbum)
albumRoute.delete("/remove", authenticate, removeSongFromAlbum)
albumRoute.post("/add", authenticate, addSongToAlbum)

export default albumRoute