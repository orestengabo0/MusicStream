import { Request, Response } from "express";
import Playlist from "../models/playlistModel";
import Song from "../models/songModel";
interface AuthenticatedRequest extends Request {
  user?: any;
}

export const getPlaylists = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const user = req.user.id;
    if (user) {
      res.status(400).json({ message: "No user found." });
      return;
    }
    const playlists = await Playlist.find({ owner: user });
    if (playlists.length === 0) {
      res.status(400).json({ message: "No playlist available." });
    }
    res.status(200).json({ message: "Success", playlists });
  } catch (error) {
    console.error("❌ ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getPlaylist = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { playlistId } = req.params;
    const user = req.user.id;
    if (user) {
      res.status(400).json({ message: "No user found." });
      return;
    }
    const playlist = await Playlist.findOne({ _id: playlistId, owner: user });
    if (!playlist) {
      res.status(400).json({ message: "No playlist available." });
    }
    res.status(200).json({ message: "Success", playlist });
  } catch (error) {
    console.error("❌ ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const createPlaylist = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { name, description, songs, owner, isPrivate } = req.body;
    const user = req.user.id;
    if (user) {
      res.status(400).json({ message: "No user found." });
      return;
    }
    const newPlaylist = new Playlist({
      name,
      description,
      songs,
      owner,
      isPrivate,
    });
    await newPlaylist.save();
    res.status(201).json({ message: "Success", newPlaylist });
  } catch (error) {
    console.error("❌ ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const addSongToPlaylist = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { songId, playlistId } = req.body;
    const currentUser = req.user.id;
    if (!currentUser) {
      res.status(400).json({ message: "No user found. Please login" });
    }
    const existingSong = await Song.findOne({
      _id: songId,
      owner: currentUser,
    });
    if (!existingSong) {
      res.status(404).json({ message: "Song not found" });
    }
    const playlist = await Playlist.findOne({
      _id: playlistId,
      owner: currentUser,
    });
    if (!playlist) {
      res.status(400).json({ message: "Playlist doesn't exist." });
    }
    if (playlist?.songs.includes(songId)) {
      res.status(400).json({ message: "Song already exists in the playlist." });
    }
    playlist?.songs.push(songId);
    await playlist?.save();
    res.status(200).json({ message: "Song added to the playlist", playlist });
  } catch (error) {
    console.error("❌ ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const removeSongFromPlaylist = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { songId, playlistId } = req.body;
    const currentUser = req.user.id;
    const playlist = await Playlist.findOne({
      _id: playlistId,
      owner: currentUser,
    });
    if (!playlist) {
      res.status(400).json({ message: "Playlist doesn't exist." });
      return;
    }
    playlist.songs = playlist.songs || [];
    if (!playlist.songs.some((s) => s.toString() === songId)) {
      res.status(400).json({ message: "Song doesn't exist in this playlist." });
      return;
    }
    playlist.songs = playlist.songs.filter((s) => s.toString() !== songId);
    await playlist.save();
    res.status(200).json({ message: "Song removed successfully.", playlist });
  } catch (error) {
    console.error("❌ ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deletePlaylist = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { playlistId } = req.params;
    const owner = req.user.id;
    if (!owner) {
      res.status(400).json({ message: "No user found." });
      return;
    }
    const playlist = await Playlist.findOne({ _id: playlistId, owner });
    if (!playlist) {
      res.status(400).json({ message: "Playlist not found." });
      return;
    }
    await Playlist.findByIdAndDelete(playlistId);
    res.status(200).json({ message: "Deleted playlist successfully." });
  } catch (error) {
    console.error("❌ ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};
