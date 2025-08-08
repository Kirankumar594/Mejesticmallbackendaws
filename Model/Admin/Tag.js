const mongoose = require("mongoose");

const TagSchema = mongoose.Schema(
  {
    tag: {
      type: String,
    },
 
   
  },
  { timeStraps: true }
);

const TagModel = mongoose.model("Tag", TagSchema);
module.exports = TagModel;
