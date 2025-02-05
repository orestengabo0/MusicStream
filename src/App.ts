import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';
import authRoute from './routes/authRoute';
import songRoute from './routes/songRoute';
import albumRoute from './routes/albumRoute';
import playlistRoute from './routes/playlistRoute';

dotenv.config();
const app = express();
app.use(express.json())

app.use("/api/auth",authRoute);
app.use("/api/songs", songRoute)
app.use("/api/albums",albumRoute)
app.use("/api/playlists",playlistRoute)

connectDB();
const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server running on port ${port}`));