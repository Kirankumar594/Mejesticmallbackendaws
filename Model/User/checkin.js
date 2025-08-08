const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema.Types;
const checkinSchema = new Schema(
      {
        checkinImage:{
            type:String
        },
        lat: {
            type: String,
          },
          long: {
            type: String,
          },
          address: {
            type: String,
          },
        date:{
            type:String
        },
        checkinId:{
            type:ObjectId,
           ref:"checkins"
        },
        checkIns : [],
 checkOuts : [],
        userId:{
            type:ObjectId,
            ref:"driver"
           
        },
        status :{
type:String,

        },
       
      },{ timestamps: true });
  
  module.exports= mongoose.model("checkin", checkinSchema);
  