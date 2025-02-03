import { Request, Response } from "express";
import Album from "../models/albumModel";
import Song from "../models/songModel";
import Artist from "../models/artistModel";

interface AuthenticatedRequest extends Request {
  user?: any;
}

export const addSongToAlbum = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { songId, albumId } = req.body;
    const currentArtist = req.user.id;
    if (!currentArtist) {
      res.status(400).json({ message: "No user found. Please login" });
    }
    const existingSong = await Song.findOne({
      _id: songId,
      artist: currentArtist,
    });
    if (!existingSong) {
      res.status(404).json({ message: "Song not found" });
    }
    const album = await Album.findOne({ _id: albumId, artist: currentArtist });
    if (!album) {
      res.status(400).json({ message: "Album doesn't exist." });
    }
    if (album?.songs.includes(songId)) {
      res.status(400).json({ message: "Song already exists in the album." });
    }
    album?.songs.push(songId);
    await album?.save();
    res.status(200).json({ message: "Song added to the album", album });
  } catch (error) {
    console.error("❌ ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const createAlbum = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { name, releaseDate, coverImage } = req.body;
    const currentArtist = req.user.id;
    if (!currentArtist) {
      res.status(400).json({ message: "No user found. Please login" });
    }
    const existingAlbum = await Album.findOne({ name, artist: currentArtist });
    if (existingAlbum) {
      res.status(400).json({ message: "Album already exists." });
    }
    const newAlbum = new Album({
      name,
      artist: currentArtist,
      releaseDate: new Date(releaseDate),
      coverImage: coverImage || "",
      songs: [],
    });
    await newAlbum.save();
    res.status(201).json({ message: "Album created successfully.", newAlbum });
  } catch (error) {
    console.error("❌ ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const removeSongFromAlbum = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { songId, albumId } = req.body;
    const currentArtist = req.user.id;
    const album = await Album.findOne({ _id: albumId, artist: currentArtist });
    if (!album) {
      res.status(400).json({ message: "Album doesn't exist." });
      return;
    }
    album.songs = album.songs || [];
    if (!album.songs.some((s) => s.toString() === songId)) {
      res.status(400).json({ message: "Song doesn't exist in this album." });
      return;
    }
    album.songs = album.songs.filter((s) => s.toString() !== songId);
    await album.save();
    res.status(200).json({ message: "Song removed successfully.", album });
  } catch (error) {
    console.error("❌ ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteAlbum = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { albumId } = req.params;
    const currentArtist = req.user.id;
    if (!currentArtist) {
      res
        .status(400)
        .json({ message: "No user found. Please login to delete song." });
      return;
    }
    const album = await Album.find({ _id: albumId, artist: currentArtist });
    if (album.length === 0) {
      res.status(400).json({ message: "Album doesn't exist" });
      return
    }
    await Album.findByIdAndDelete(albumId)
    res.status(200).json({ message: "Album deleted."})
  } catch (error) {
    console.error("❌ ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};