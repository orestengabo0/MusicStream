import express from 'express'
import { register, login } from "../controllers/authController"

const authRoute = express.Router()

authRoute.post('/register', register)
authRoute.post('/login', login)

export default authRoute