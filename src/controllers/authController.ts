import { Request, Response } from 'express';
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/userModel'
import dotenv from "dotenv"
import cloudinary from '../cloudinary/cloudinary';

dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET!

export const register = async (req: Request, res: Response): Promise<void> => {
    const { username, email, password, role } = req.body

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
            role,
            profileImage
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
        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
            expiresIn: "3h",
        });
        res.status(200).json({ message: "Login successful", token });
    }catch(error){
        console.error(`Error: ${(error as Error).message}`)
        res.status(500).json({message: "Server Error"})
    }
}