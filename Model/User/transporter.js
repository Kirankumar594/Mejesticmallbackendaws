const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const transportsSchema = new Schema(
      {
        profile:{
            type:String
        },
        name:{
            type:String
        },
        mobile:{
            type: Number
          },
        email:{
            type:String
        },
        gender:{
            type:String
        },
        password:{
            type:String
        },
      },{ timestamps: true });
  
  module.exports= mongoose.model("transport", transportsSchema);
  