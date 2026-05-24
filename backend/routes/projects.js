const express=require('express');
const router=express.Router(); 

const Project=require('../models/Project');

router.get('/',async(req,res)=>{
    try{
        const projects=await Project.find();
        res.json(projects);
    }
    catch(err){
        res.status(500).json({message:"Server Error",error: err.message});
    }
});

router.post('/',async(req,res)=>{
    try{
        const newProject=new Project({
            name:req.body.name,
            description:req.body.description
        });
        const savedProject=await newProject.save();
        res.status(201).json(savedProject);
    }
    catch(err){
        res.status(400).json({message:"Error creating project",error: err.message});
    }
});

module.exports=router;