import express from 'express'
import { register, login, updateProfile } from "../controllers/userAuthController"
import upload from '../cloudinary/profilePicStorageConfig'
import { authenticate } from '../config/authMiddleware'
import { loginArtist, registerArtist, updateArtistProfile } from '../controllers/artistAuthController'

const authRoute = express.Router()

authRoute.post('/register', upload.single("profileImage"), register)
authRoute.post('/login', login)
authRoute.put("/update", authenticate, upload.single("profileImage"),updateProfile)
authRoute.post('/artist/register', upload.single("artistProfileImage"), registerArtist)
authRoute.post("/artist/login", loginArtist)
authRoute.put("/artist/update", authenticate, upload.single("artistProfileImage"), updateArtistProfile)

export default authRoute