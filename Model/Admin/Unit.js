const mongoose = require("mongoose");

const UnitSchema = mongoose.Schema(
  {
    unit: {
      type: String,
    },
 
   
  },
  { timeStraps: true }
);

const UnitModel = mongoose.model("Unit", UnitSchema);
module.exports = UnitModel;
