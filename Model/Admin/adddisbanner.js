const mongoose = require("mongoose");

const bannerdiscountSchema = new mongoose.Schema(
    {
       banner: {
        type: String,       
       },   
      
      link: {
        type: String,
      
      },           
    },
    { timestamps: true }
);

const bannerdiscountModel = mongoose.model("bannerdiscount", bannerdiscountSchema);
module.exports = bannerdiscountModel;