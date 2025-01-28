import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';

dotenv.config();
const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!');
});
connectDB();
const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server running on port ${port}`));