const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const videoSchema = new Schema(
      {
        video:{
            type:String
        },
        name:{
            type:String
        }
      },{ timestamps: true });
  
  module.exports= mongoose.model("video", videoSchema);
  