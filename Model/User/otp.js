const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const otp = new Schema(
      {
         otp: {
          type: Number,
         }, 
         mobile: {
          type: String,
        },
        type: {
          type: String,

        },
        expire_at: {
            type: Date, 
            default: Date.now, 
            expires: 300, 
        },     
      },{ timestamps: true }
  );
  module.exports = mongoose.model("otp", otp);
