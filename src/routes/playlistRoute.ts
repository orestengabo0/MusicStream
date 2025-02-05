import express from "express"
import { authenticate } from "../config/authMiddleware"
import { addSongToPlaylist, createPlaylist, deletePlaylist, getPlaylist, getPlaylists, removeSongFromPlaylist } from "../controllers/playlistController"
const playlistRoute = express.Router()

playlistRoute.post("/create",authenticate,createPlaylist)
playlistRoute.get("/",authenticate,getPlaylists)
playlistRoute.get("/playlistId",authenticate,getPlaylist)
playlistRoute.post("/add",authenticate,addSongToPlaylist)
playlistRoute.delete("/remove",authenticate,removeSongFromPlaylist)
playlistRoute.delete("/delete/:id",authenticate,deletePlaylist)

export default playlistRoute