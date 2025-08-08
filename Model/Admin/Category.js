const mongoose = require("mongoose");

const CategorySchema = mongoose.Schema(
  {   
    categoryName: {
      type: String,
    },
   categoryimage:{
      type: String,
    },
    status:{
      type:String,
      default:"Active"
  },
  },
  { timeStraps: true }
);

const CategoryModel = mongoose.model("Category", CategorySchema);
module.exports = CategoryModel;
