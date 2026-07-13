import mongoose from 'mongoose';
import { ITask } from '../types';

const taskSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title:{
        type:String,
        required:true,
        trim:true 
    },
    description:{
        type:String,
        trim:true 
    },
    status:{
        type:String,
        enum:["To Do","In Progress","Done"],
        default:"To Do"
    },
    priority:{
        type:String,
        enum:["Low","Medium","High"],
        default:"Medium"
    },
    project:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Project',
        requires:true
    },
    assignee:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        default:null 
    },
    updatedAt:{
        type:Date,
        default:Date.now
    }
});

export default mongoose.model<ITask>("Task", taskSchema);