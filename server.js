
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Feedback from './models/Feedback.js';

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

let dbConnection;

async function connectDB() {
    if (mongoose.connection.readyState === 1) {
        return;
    }

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
        await connectDB();

        const feedback = new Feedback({
            name: req.body.name,
            rating: req.body.rating,
            comments: req.body.comments
        });

        await feedback.save();

        res.status(201).json({
            message: 'Feedback submitted successfully',
            feedback
        });
    } catch (error) {
        console.error('SAVE ERROR:', error);
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
        console.error('FETCH ERROR:', error);
        res.status(500).json({
            message: 'Failed to get feedback'
        });
    }
});

export default app;
