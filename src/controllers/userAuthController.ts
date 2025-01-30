import { Request, Response } from 'express';
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/userModel'
import dotenv from "dotenv"
import cloudinary from '../cloudinary/cloudinary';

interface AuthenticatedRequest extends Request {
    user?: any;
}

dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET!

export const register = async (req: Request, res: Response): Promise<void> => {
    const { username, email, password } = req.body

    try{
        const existingUser = await User.findOne({email})
        if(existingUser){
            res.status(400).json({message: "User already exists"})
            return
        }
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt);

        let profileImage = ""
        if(req.file){
            const uploadedImage = await cloudinary.uploader.upload(req.file.path, {folder: "profile_pictures"})
            profileImage = uploadedImage.secure_url
        }
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
            profileImage,
        })
        res.status(201).json({ message: "User registered successfully", user: newUser });
    }catch(error){
        console.error(`Error: ${(error as Error).message}`)
        res.status(500).json({message: "Server Error"})
    }
}

export const login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body

    try{
        const user = await User.findOne({email})
        if(!user){
            res.status(400).json({message: "Invalid credentials"})
            return
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            res.status(400).json({message: "Invalid credentials"})
            return
        }
        const token = jwt.sign({ id: user._id, v: user.__v }, JWT_SECRET, {
            expiresIn: "3h",
        });
        res.status(200).json({ message: "Login successful", token });
    }catch(error){
        console.error(`Error: ${(error as Error).message}`)
        res.status(500).json({message: "Server Error"})
    }
}

export const updateProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const userId = req.user?.id;
    const { username, email, password } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({ message: "User not found." });
            return;
        }

        if (username) user.username = username;
        if (email) user.email = email;

        if (password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }

        if (req.file) {
            if (user.profileImage) {
                const publicId = user.profileImage.split('/').pop()?.split('.')[0]; // Extract public_id
                await cloudinary.uploader.destroy(`profile_pictures/${publicId}`);
            }

            const uploadedImage = await cloudinary.uploader.upload(req.file.path, { folder: "profile_pictures" });
            user.profileImage = uploadedImage.secure_url;
        }

        await user.save();
        res.status(200).json({ message: "Profile updated successfully", user });
    } catch (error) {
        console.error(`Error: ${(error as Error).message}`);
        res.status(500).json({ message: "Server Error" });
    }
};

