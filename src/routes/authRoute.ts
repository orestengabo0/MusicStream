import express from 'express'
import { register, login, updateProfile } from "../controllers/authController"
import upload from '../cloudinary/multerConfig'
import { authenticate } from '../config/authMiddleware'

const authRoute = express.Router()

authRoute.post('/register', upload.single("profileImage"), register)
authRoute.post('/login', login)
authRoute.put("/update", authenticate, upload.single("profileImage"),updateProfile)

export default authRoute