import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Feedback from './models/Feedback.js'

dotenv.config()

const app = express()

app.use(express.json())
app.use(express.static('public'))

console.log("MONGODB_URI exists:", !!process.env.MONGODB_URI)

mongoose.connect(process.env.MONGODB_URI)
.then(() => {
    console.log('MongoDB connected')
})
.catch((error) => {
console.log("MongoDB connection failed", error)
})


app.post("/feedback", async (req,res) => {
    console.log("BODY:", req.body)
    try{
        const feedback = new Feedback({
            name: req.body.name,
            rating: req.body.rating,
            comments: req.body.comments
        })

         console.log("BEFORE SAVE:", feedback)
        await feedback.save()
         console.log("AFTER SAVE:", feedback)

        res.status(201).json({
            message: "Feedback submitted successfully",
            feedback: feedback
        })
    } catch (error) {
        console.log("SAVE ERROR:", error)

        res.status(500).json({
            message: "failed to submit feedback",
            error: error.message
        })
    }
})

app.get("/feedback", async(req, res) => {
    try{
        const feedback = await Feedback.find()
        res.json(feedback)
    } catch (error) {
        console.log(error)
        
        res.status(500).json({
            message: "Failed to get feedback"
        })
    }
})


app.listen(3000, () => {
    console.log("server is running on port 3000")
})