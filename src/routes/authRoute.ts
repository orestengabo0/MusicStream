import express from 'express'
import { register, login } from "../controllers/authController"
import upload from '../cloudinary/multerConfig'

const authRoute = express.Router()

authRoute.post('/register', upload.single("profileImage"), register)
authRoute.post('/login', login)

export default authRoute