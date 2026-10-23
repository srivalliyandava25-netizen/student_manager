
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Feedback from './models/Feedback.js';

dotenv.config();

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

let dbConnection;

async function connectDB() {
    if (mongoose.connection.readyState === 1) return;

    if (!dbConnection) {
        dbConnection = mongoose.connect(process.env.MONGODB_URI)
            .catch((error) => {
                dbConnection = null;
                throw error;
            });
    }

    await dbConnection;
}

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/feedback', async (req, res) => {
    try {
        console.log('POST /feedback received');
        await connectDB();
        console.log('MongoDB connection ready');

        const feedback = new Feedback({
            name: req.body.name,
            rating: req.body.rating,
            comments: req.body.comments
        });

        await feedback.save();
        console.log('Feedback saved successfully');

        res.status(201).json({
            message: 'Feedback submitted successfully',
            feedback
        });
    } catch (error) {
        console.error('FEEDBACK ERROR:', error.name, error.message);

        res.status(500).json({
            message: 'Failed to submit feedback'
        });
    }
});

app.get('/feedback', async (req, res) => {
    try {
        await connectDB();
        const feedback = await Feedback.find();
        res.json(feedback);
    } catch (error) {
        console.error('FETCH FEEDBACK ERROR:', error.name, error.message);
        res.status(500).json({
            message: 'Failed to get feedback'
        });
    }
});

export default app;
