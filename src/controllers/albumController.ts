import { Request, Response } from "express";
import Album from "../models/albumModel";
import Song from "../models/songModel";
import { albumValidator } from "../validation/albumValidator";

interface AuthenticatedRequest extends Request {
  user?: any;
}

export const addSongToAlbum = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const { error } = albumValidator.addSongToAlbum.validate(req.body);
  if(error){
    res.status(404).send(error.details[0].message)
  }
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

export const getMyAlbums = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const currentArtist = req.user.id;
    const albums = await Album.find({ artist: currentArtist });

    if (albums.length === 0) {
      res.status(400).json({ message: "No album found." });
      return;
    }
    res.status(200).json({ message: "Success", albums });
  } catch (error) {
    console.error("❌ ERROR:", error);
    res.status(500).json({ message: "Server error" });
    return;
  }
};

export const getMyAlbum = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { albumId } = req.params;
    const currentArtist = req.user.id;
    const album = await Album.findOne({ _id: albumId, artist: currentArtist });
    if (!album) {
      res
        .status(400)
        .json({ message: "Album you are trying to get is not available." });
    }
    res.status(200).json({ message: "Success", album });
  } catch (error) {
    console.error("❌ ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const createAlbum = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const { error } = albumValidator.createAlbum.validate(req.body);
  if(error){
    res.status(404).send(error.details[0].message)
  }
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
    const parsedReleaseDate = new Date(releaseDate);
    if (isNaN(parsedReleaseDate.getTime())) {
      res.status(400).json({ message: "Invalid release date provided." });
      return;
    }
    if (parsedReleaseDate > new Date()) {
      res
        .status(400)
        .json({ message: "Release date cannot be in the future." });
      return;
    }
    const newAlbum = new Album({
      name,
      artist: currentArtist,
      releaseDate: parsedReleaseDate,
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
    const currentArtist = req.user?.id;

    if (!currentArtist) {
      res
        .status(400)
        .json({ message: "No user found. Please login to delete the album." });
      return;
    }

    const album = await Album.findOne({ _id: albumId, artist: currentArtist });
    if (!album) {
      res.status(400).json({ message: "Album doesn't exist." });
      return;
    }

    await Album.findByIdAndDelete(albumId);
    res.status(200).json({ message: "Album deleted successfully." });
  } catch (error) {
    console.error("❌ ERROR:", error);
    res.status(500).json({ message: "Server error" });
    return;
  }
};