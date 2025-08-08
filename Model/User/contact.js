const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema.Types;

const contactSchema = new Schema(
  {
    fullName: {
      type: String,
    },
    number: {
      type: String,
    },
    email: {
      type: String,
    },
    text: {
      type: String,
    },
    userId: {
      type: String
    },
    userName:{
        type:String
    },
    userImg:{
        type:String
    },
    address:{
      type:String
    },
    status:{
        type:String,
        default:'pending'
    }
 },{ timestamps: true });
module.exports = mongoose.model("contact", contactSchema);
