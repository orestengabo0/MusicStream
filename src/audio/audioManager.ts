import cloudinary from "../cloudinary/cloudinary";
import fs from "fs"
import ffmpeg from "fluent-ffmpeg";
import ffmpegStatic from "ffmpeg-static";

ffmpeg.setFfmpegPath(ffmpegStatic as string);

export const uploadSong = async (filePath: string): Promise<string | undefined> => {
    try {
      const result = await cloudinary.uploader.upload(filePath, {
        resource_type: "video",
      });
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      } else {
        console.warn("⚠️ Local file not found, skipping deletion:", filePath);
      }
      return result.public_id;
    } catch (error) {
      console.error("❌ Error uploading audio:", error);
    }
  };
  
export const getAudioMetadata = async (publicId: string): Promise<any> => {
    try {
      const result = await cloudinary.api.resource(publicId, {
        resource_type: "video",
      });
      return result;
    } catch (error) {
      console.error("❌ Error fetching metadata:", error);
    }
  };
  
export const extractAudioMetadata = async (filePath: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(filePath, (err, metadata) => {
        if (err) reject(err);
        const audioStream = metadata.streams.find(
          (stream) => stream.codec_type === "audio"
        );
        if (audioStream) {
          resolve({
            duration: audioStream.duration,
            bitrate: audioStream.bit_rate,
            codec: audioStream.codec_name,
            sampleRate: audioStream.sample_rate,
            channels: audioStream.channels,
          });
        } else {
          reject(new Error("No audio file found."));
        }
      });
    });
  };
  