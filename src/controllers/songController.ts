import { Request, Response } from "express";
import cloudinary from "../cloudinary/cloudinary";
import Song from "../models/songModel";
import { songValidator } from "../validation/songValidator";
import {
  extractAudioMetadata,
  getAudioMetadata,
  uploadSong,
} from "../audio/audioManager";

interface AuthenticatedRequest extends Request {
  user?: any;
}

export const getSong = async (req: AuthenticatedRequest, res: Response):Promise<void> => {
  try{
    const { songId } = req.params;
    const song = await Song.findOne({_id:songId})
    if(!song){
      res.status(400).json({ message: "No song found."})
      return 
    }
    res.status(200).json({ message: "Success", song })
  }catch(error){
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(String(error));
    }
  }
}

export const getSongs = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user.id;
    if (!user) {
      res
        .status(400)
        .json({ message: "User not found. Please login to view songs." });
    }
    const songs = await Song.find({ artist: user });
    if (songs.length === 0) {
      res.status(404).json({ message: "No song found." });
    }
    res.status(200).json({ message: "Success", songs });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(String(error));
    }
  }
};

export const createSong = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { error } = songValidator.createSong.validate(req.body);
    if (error) {
      res.status(400).json({ message: error.details[0].message });
      return;
    }

    const { title, genre, album, releaseDate, featuredArtists, coverImage } =
      req.body;
    const currentArtist = req.user?.id;
    if (!currentArtist) {
      res.status(400).json({
        message: "No artist logged in. Please login to upload your songs.",
      });
    }

    if (!req.file) {
      res.status(400).json({ message: "Audio file is required." });
      return;
    }

    const audioMetadata = await extractAudioMetadata(req.file.path);
    const publicId = await uploadSong(req.file.path);

    if (!publicId) {
      res.status(500).json({ message: "Failed to upload audio." });
      return;
    }
    const cloudinaryMetadata = await getAudioMetadata(publicId);
    const durationMetadata = audioMetadata.duration || 0;
    const duration = Math.floor(durationMetadata);

    const newSong = new Song({
      title,
      artist: currentArtist,
      genre,
      album,
      releaseDate: new Date(releaseDate),
      duration,
      audioUrl: cloudinaryMetadata?.secure_url,
      coverImage: coverImage || "",
      featuredArtists:
        typeof featuredArtists === "string" ? featuredArtists.split(",") : [],
    });

    await newSong.save();
    res
      .status(201)
      .json({ message: "Song created successfully!", song: newSong });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteSong = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { songId } = req.params;
    const currentArtist = req.user?.id;

    if (!currentArtist) {
      res.status(400).json({ message: "No user found. Please login to delete song." });
      return 
    }

    const song = await Song.findById(songId);
    if (!song) {
      res.status(404).json({ message: "Song not found." });
      return 
    }

    if (song.audioUrl) {
      const publicId = song.audioUrl.split("/").pop()?.split(".")[0];
      if (publicId) {
        await cloudinary.uploader.destroy(publicId, { resource_type: "video" });
        console.log("✅ File deleted from Cloudinary:", publicId);
      }
    }

    // Delete the song from the database
    await Song.findByIdAndDelete(songId);
    res.status(200).json({ message: "✅ Song deleted successfully." });
  } catch (error) {
    console.error("❌ ERROR:", error);
    res.status(500).json({ message: "Server error" });
    return 
  }
};