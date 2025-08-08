const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema(
    {
       banner: {
        type: String,       
       },   
      
      type: {
        type: String,
      
      },           
    },
    { timestamps: true }
);

const bannerModel = mongoose.model("banner", bannerSchema);
module.exports = bannerModel;