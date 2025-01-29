import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';
import authRoute from './routes/authRoute';

dotenv.config();
const app = express();
app.use(express.json())

app.use("/api/auth",authRoute);

connectDB();
const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server running on port ${port}`));