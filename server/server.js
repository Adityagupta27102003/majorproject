import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import 'dotenv/config';
import { clerkWebhooks } from './controllers/webhooks.js';
import companyRoutes from './routes/companyRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { clerkMiddleware } from '@clerk/express';
import connectCloudinary from './config/cloudinary.js';
const app = express();

// Database connection
await connectDB();
await connectCloudinary();
// Middleware
app.use(cors());

// 👇 Critical: Preserve raw body for webhook verification
app.use(express.json({
    verify: (req, res, buf) => {
        req.rawBody = buf.toString(); // Store raw body for Svix verification
    }
}));
app.use(clerkMiddleware())

// Routes
app.get('/', (req, res) => {
    res.send('API working!');
});

// Webhook endpoint
app.post('/webhooks', clerkWebhooks);
app.use('/api/company', companyRoutes);
app.use('/api/jobs', jobRoutes)
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});