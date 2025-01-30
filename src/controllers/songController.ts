import { Request, Response } from "express";
import ffmpeg from "fluent-ffmpeg";
import ffmpegStatic from "ffmpeg-static";
import cloudinary from "../cloudinary/cloudinary";
import fs from "fs";
import Song from "../models/songModel"; // Import the Song model
import { songValidator } from "../validation/songValidator"; // Import validation
import mongoose from "mongoose";

ffmpeg.setFfmpegPath(ffmpegStatic as string);

export const uploadSong = async (file: Express.Multer.File): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!file) {
      return reject("No file uploaded.");
    }

    const inputPath = file.path;
    const outputPath = `compressed-${Date.now()}.mp3`;

    ffmpeg(inputPath)
      .audioBitrate("128k")
      .toFormat("mp3")
      .on("end", async () => {
        try {
          const result = await cloudinary.uploader.upload(outputPath, {
            resource_type: "video",
            folder: "songs",
          });

          fs.unlinkSync(outputPath); // Remove temp file after upload
          resolve(result.secure_url);
        } catch (error) {
          reject("Error uploading to Cloudinary");
        }
      })
      .on("error", (err) => reject(err.message))
      .save(outputPath);
  });
};

export const createSong = async (req: Request, res: Response): Promise<void> => {
  try {
    const { error } = songValidator.createSong.validate(req.body);
    if (error) {
      res.status(400).json({ message: error.details[0].message });
      return;
    }

    const { title, artist, genre, album, releaseDate, duration, featuredArtists } = req.body;

    if (!req.file) {
      res.status(400).json({ message: "Audio file is required." });
      return;
    }

    const audioUrl = await uploadSong(req.file);

    const newSong = new Song({
      title,
      artist: new mongoose.Types.ObjectId(artist),
      genre,
      album,
      releaseDate: new Date(releaseDate),
      duration,
      audioUrl,
      coverImage: req.body.coverImage || "",
      featuredArtists: featuredArtists ? featuredArtists.split(",") : [],
    });

    await newSong.save();
    res.status(201).json({ message: "Song created successfully!", song: newSong });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
