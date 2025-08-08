const mongoose = require("mongoose");

const SubcategorySchema = mongoose.Schema(
  {
   categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
    SubcategoryName: {
      type: String,
    },
    status:{
      type:String,
      default:"Active"
  },
   
  },
  { timeStraps: true }
);

const SubcategoryModel = mongoose.model("Subcategory", SubcategorySchema);
module.exports = SubcategoryModel;
