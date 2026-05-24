const mongoose=require('mongoose');

const ProjectSchema=mongoose.Schema({
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

module.exports=mongoose.model('Project',ProjectSchema);