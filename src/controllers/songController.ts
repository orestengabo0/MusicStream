import { Request, Response } from "express";
import ffmpeg from "fluent-ffmpeg";
import ffmpegStatic from "ffmpeg-static";
import cloudinary from "../cloudinary/cloudinary";
import fs from "fs";

ffmpeg.setFfmpegPath(ffmpegStatic as string);

export const uploadSong = async (req: Request, res: Response):Promise<void> => {
  try {
    if (!req.file) {
        res.status(400).send("No file uploaded.");
        return
    }
    const inputPath = req.file.path;
    const outputPath = `compressed-${Date.now()}.mp3`;
    ffmpeg(inputPath)
      .audioBitrate("128k")
      .toFormat("mp3")
      .on("end", async () => {
        const result = await cloudinary.uploader.upload(outputPath, {
          resource_type: "video",
          folder: "songs",
        });

        fs.unlinkSync(outputPath);
        res.status(201).json({
          message: "Song uploaded successfully!",
          audioUrl: result.secure_url,
        });
      })
      .on("error", (err) => {
        console.error(err);
        res.status(500).json({ message: "Error processing audio file" });
      })
      .save(outputPath);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
