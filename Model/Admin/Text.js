const mongoose = require("mongoose");

const TextSchema = mongoose.Schema(
  {
    text: {
      type: String,
    },
    category: {
      type: String,
    },
    
    fromDay: {
      type: String,
    },
    
     toDay: {
      type: String,
    },
    fromTime:{
      type: String,
    },
     endTime:{
      type: String,
    },
    minOrder:{
         type: Number,
      default:0
    },
    minKm:{
         type: Number,
      default:0
    },
     deliveryCharge:{
      type: Number,
      default:0
    },
    perKmCharge:{
         type: Number,
      default:0
    },
    isActive:{
        type:Boolean,
        default:true
    }
  },
  { timeStraps: true }
);

const TextModel = mongoose.model("Text", TextSchema);
module.exports = TextModel;
