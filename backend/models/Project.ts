import mongoose from 'mongoose';
import { IProject } from '../types';

const ProjectSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name:{
        type:String,
        requires:true,
        trim:true
    },
    description:{
        type:String,
        trim:true
    },
    members:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }],
    createdAt:{
        type:Date,
        default:Date.now 
    }
});

export default mongoose.model<IProject>('Project', ProjectSchema);