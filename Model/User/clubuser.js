const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const clubuserSchema = new Schema(
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
        status:{
            type:String,
            default:"Approved"
        },
        expiredate:{
          type:String  
        },
        club:{
            type:Boolean,
            default:true
        }
      },{ timestamps: true });
  
  module.exports= mongoose.model("clubuser", clubuserSchema);
  