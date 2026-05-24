const express=require('express');
const router=express.Router();

const Task=require('../models/Task');
//get all tasks for a project
router.get('/project/:projectId',async(req,res)=>{
    try{
        const tasks=await Task.find({project:req.params.projectId});
        res.json(tasks);
    }
    catch(err){
        res.status(500).json({message:"Server Error",error: err.message});
    }
});

//create new task
router.post('/',async(req,res)=>{
    try{
        const {title,description,priority,project}=req.body;
        const newTask=new Task({
            title,
            description,
            priority,
            project
        });
        const savedTask=await newTask.save();
        res.status(201).json(savedTask);
    }
    catch(err){
        res.status(400).json({message:"Error creating task",error: err.message});
    }
});

//update task status on shift
router.put('/:id',async(req,res)=>{
    try{
        const updatedTask=await Task.findByIdAndUpdate(req.params.id,{status:req.body.status,updatedAt:Date.now()},{returnDocument:'after'});
        if(!updatedTask){
            return res.status(404).json({message:"task not found"});
        }
        res.json(updatedTask);
    }
    catch(err){
        res.status(400).json({message:"Error shifting task card status",error: err.message});
    }
});

module.exports=router;
