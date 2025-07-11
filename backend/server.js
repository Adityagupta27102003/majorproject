import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/db.js';
const app = express();

await connectDB();
// middleware
app.use(cors());
app.use(express.json());


//routes
app.get('/', (req, res) => res.send("API Working"));
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));