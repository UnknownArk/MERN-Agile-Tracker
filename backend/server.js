const express=require('express');
const cors=require('cors');
const mongoose=require('mongoose');
require('dotenv').config();//read var from .env

const app=express();
const port=process.env.PORT || 5000;
const dbURI = process.env.MONGO_URL||'mongodb://127.0.0.1:27017/jira-db';
app.use(cors());
app.use(express.json());

app.get('/',(req,res)=>{
    res.send("backend server is running");
});

const projectRoutes=require('./routes/projects');
const taskRoutes=require('./routes/tasks');
app.use('/api/projects',projectRoutes);
app.use('/api/tasks',taskRoutes);

mongoose.connect(dbURI)
.then(()=>console.log('Connected to MongoDB'))
.catch((err)=>console.log('Error connecting to MongoDB:',err));

app.listen(port,()=>{
    console.log(`Server is running on port: ${port}`);
});