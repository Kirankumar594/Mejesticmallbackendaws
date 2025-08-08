const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
      {
       
        name:{
            type:String
        },
        mobile:{
            type: String
          },
          Amobile:{
            type: Number
          },
          Houseno:{
            type: String
          },
        email:{
            type:String
        },
        address1:{
            type:String
        },
        address2:{
            type:String
        },
        landmark:{
            type:String
        },
        pincode:{
            type:Number
        },
        deliveryzone:{
            type:String
        },
        password:{
            type:String
        },
        cpassword:{
            type:String
        },
        otp: {
            type: Number,
           }, 
        status:{
            type:String,
            default:"pending"
        },
        clubRegisteredDate : {
            type: String,
           }, 
        club:{
            type:Boolean,
            default:false
        },
       
        expiredate:{
            type:String
        },
        lat:{
           type: Number,
        },
        lng:{
            type: Number, 
        }
      },{ timestamps: true });
  
  module.exports= mongoose.model("user", userSchema);
  