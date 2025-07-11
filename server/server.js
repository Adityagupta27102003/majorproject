import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import 'dotenv/config';
import authRoutes from './routes/authRoutes.js';

const app = express();

// Database connection
await connectDB();

// Middleware
app.use(cors());

// 👇 Critical: Preserve raw body for webhook verification
app.use(express.json({
    verify: (req, res, buf) => {
        req.rawBody = buf.toString(); // Store raw body for Svix verification
    }
}));

// Routes
app.get('/', (req, res) => {
    res.send('API working!');
});
app.use('/api/auth', authRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});