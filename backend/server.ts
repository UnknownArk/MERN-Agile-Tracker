import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config(); // read var from .env

const app=express();
const port=process.env.PORT || 5000;
const dbURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/sprintforge-db';
app.use(cors());
app.use(express.json());

app.get('/',(req,res)=>{
    res.send("backend server is running");
});

import projectRoutes from './routes/projects';
import taskRoutes from './routes/tasks';
import authRoutes from './routes/auth';

app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/auth', authRoutes);

mongoose.connect(dbURI)
.then(()=>console.log('Connected to MongoDB'))
.catch((err)=>console.log('Error connecting to MongoDB:',err));

app.listen(port,()=>{
    console.log(`Server is running on port: ${port}`);
});