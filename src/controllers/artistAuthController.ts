import Artist from "../models/artistModel";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import cloudinary from "../cloudinary/cloudinary";

interface AuthenticatedRequest extends Request {
  user?: any;
}

export const registerArtist = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, email, password, bio, genres } = req.body;

    const existingArtist = await Artist.findOne({ email });
    if (existingArtist) {
      res.status(400).json({ message: "Artist already exists" });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let artistProfileImage = "";
    if (req.file) {
      const uploadedProfileImage = await cloudinary.uploader.upload(
        req.file.path,
        { folder: "artists_profile_pictures" }
      );
      artistProfileImage = uploadedProfileImage.secure_url;
    }
    const newArtist = await Artist.create({
      name,
      email,
      password: hashedPassword,
      bio,
      genres,
      artistProfileImage,
    });

    res
      .status(201)
      .json({ message: "Artist registered successfully!", artist: newArtist });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const loginArtist = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;

    const artist = await Artist.findOne({ email });
    if (!artist) {
      res.status(400).json({ message: "Artist not found" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, artist.password);
    if (!isPasswordValid) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    const token = jwt.sign(
      { id: artist._id, v: artist.__v },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    res.status(200).json({ message: "User logged in successfully.", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateArtistProfile = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const artistId = req.user?.id;
  const { artistname, email, password, bio, genres } = req.body;

  try {
    const artist = await Artist.findById(artistId);
    if (!artist) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    if (artistname) artist.name = artistname;
    if (email) artist.email = email;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      artist.password = await bcrypt.hash(password, salt);
    }
    if (bio) artist.bio = bio;
    if (genres) artist.genres = genres;

    if (req.file) {
      if (artist.artistProfileImage) {
        const publicId = artist.artistProfileImage
          .split("/")
          .pop()
          ?.split(".")[0];
        await cloudinary.uploader.destroy(
          `artists_profile_pictures/${publicId}`
        );
      }

      const uploadedImage = await cloudinary.uploader.upload(req.file.path, {
        folder: "artists_profile_pictures",
      });
      artist.artistProfileImage = uploadedImage.secure_url;
    }

    await artist.save();
    res
      .status(200)
      .json({ message: "Profile updated successfully", user: artist });
  } catch (error) {
    console.error(`Error: ${(error as Error).message}`);
    res.status(500).json({ message: "Server Error" });
  }
};
