const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema.Types;

const AddressSchema = new Schema(
  {
    fullName: {
      type: String,
    },
    number: {
      type: String,
    },
    anumber: {
      type: String,
    },
    landmark: {
      type: String,
    },
    doorno: {
      type: String,
    },
    email: {
      type: String,
    },
    state: {
      type: String,
    },
    city: {
      type: String,
    },
    pincode:{
        type:Number
    },
    street:{
        type:String
    },
    country:{
        type:String
    },
    userId: {
      type: String,
    },
     lat:{
           type: Number,
    },
    lng:{
      type: Number, 
    }
    
 },{ timestamps: true });
module.exports = mongoose.model("userAddress", AddressSchema);