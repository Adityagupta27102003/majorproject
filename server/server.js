import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import 'dotenv/config'
import { clerkWebhooks } from './controllers/webhooks.js';

// initialize express app
const app = express();
await connectDB();
// middleware
app.use(cors());
app.use(express.json());
// routes
app.get('/', (req, res) => {
    res.send('api working!');
});
app.post('/webhooks', clerkWebhooks);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});