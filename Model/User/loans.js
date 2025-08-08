const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const {ObjectId}=Schema.Types;

const loanSchema = new Schema(
      {
        mobile: {
          type: Number,
        },
        userProfile:{
            type:String
        },
        userName:{
            type:String
        },
        email:{
            type:String
        },
        desireAmount:{
            type:String
        },
        rate:{
            type:Number
        },
        year:{
            type:Number
        },
        totalAmount:{
            type:Number
        },
        rentAmount:{
            type:Number
        },
        userId:{
            type:ObjectId
        },
        userDoc:{
            panCard:{type:String},
            adharCard:{type:String},
            incomeCerticate:{type:String},
            residance:{type:String},
            bankStatement:{type:String}
        },
        productId:{
            type:ObjectId
        },
        status:{
            type:String,
            default:"pending"
        }

      },{ timestamps: true });
  
  module.exports= mongoose.model("loan", loanSchema);
  