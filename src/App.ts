import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';
import authRoute from './routes/authRoute';
import songRoute from './routes/songRoute';
import albumRoute from './routes/albumRoute';

dotenv.config();
const app = express();
app.use(express.json())

app.use("/api/auth",authRoute);
app.use("/api/songs", songRoute)
app.use("/api/albums",albumRoute)

connectDB();
const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server running on port ${port}`));