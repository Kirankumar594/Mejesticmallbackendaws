const mongoose = require("mongoose");

const promocodeSchema = new mongoose.Schema(
  {
    promocode: {
      type: String,
    },
    enddate: {
      type: Date ,
    },
    startdate: {
      type: Date ,
    },
    discountpercentage: {
      type: Number,
    },
    code: { type: String, unique: true, required: true },
    used:[{
      userId:{
          type:String
      },
      userName:{
          type:String
      }
  }],
  },
  { timestamps: true }
);

const promocodeModel = mongoose.model("promocodes", promocodeSchema);
module.exports = promocodeModel;
