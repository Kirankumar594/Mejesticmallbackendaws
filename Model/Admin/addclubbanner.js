const mongoose = require("mongoose");

const clubbannerSchema = new mongoose.Schema(
    {
       clubbanner: {
        type: String,       
       },   
      
      type: {
        type: String,
     
      },           
    },
    { timestamps: true }
);

const clubbannerModel = mongoose.model("clubbanner", clubbannerSchema);
module.exports = clubbannerModel;