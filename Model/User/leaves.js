const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const {ObjectId}=Schema.Types;

const leavesSchema = new Schema(
      {
        FromDate: {
          type: String,
        },
        ToDate:{
            type:String
        },
        FromDay :{
            type:String
        },
        ToDay :{
            type:String
        },
        userName:{
            type:String
        },
        LeaveType:{
            type:String
        },
        
        
        userId:{
            type:ObjectId,
            
        },
        
        status:{
            type:String,
            // default:"pending"
        }, 
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    approvalDate: {
        type: Date
    },

      },{ timestamps: true });
  
  module.exports= mongoose.model("leaves", leavesSchema);
  