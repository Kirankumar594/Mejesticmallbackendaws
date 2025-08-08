const mongoose = require("mongoose");

const TitleSchema = mongoose.Schema(
  {
    title: {
      type: String,
    },
 
   
  },
  { timeStraps: true }
);

const TitleModel = mongoose.model("Title", TitleSchema);
module.exports = TitleModel;
