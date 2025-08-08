const UnitModel = require("../../Model/Admin/Unit");

class Unit {
  async addUnit(req, res) {
    let { unit } = req.body;
   

    let add = new UnitModel({
      unit: unit,
     
     
    });
    let save = add.save();
    if (save) {
      
      return res.json({ sucess: "Unit added successfully" });
     
    }
  }

  async getUnit(req, res) {
    let Unit = await UnitModel.find({}).sort({ _id: -1 });
    if (Unit) {
      return res.json({ Unit: Unit });
    }
  }

  async postUnit(req, res) {
    let { unit } = req.body;
    let Unit = await UnitModel
      .find({ unit })
      .sort({ _id: -1 });
      console.log(Unit);
    if (Unit) {
      return res.json({ Unit: Unit });
    }
  }
  async updateUnit(req, res) {
    const id = req.params.id;
    let {unit } = req.body;
      let obj = {};
       if (unit) {
        obj["unit"] = unit;
      }
    
   
    
    try {
      await UnitModel
        .findOneAndUpdate(
          { _id: id },
           { $set: obj },
        { new: true }
        )
        
       let user = await UnitModel.findOne({_id:id});
       if(user){
           return res.json({success:"success"})
       }
       else{
           return res.json({error:"error"})
       }
    } catch (err) {
      console.log(err);
    }
  }

 async postdeleteUnit(req, res) {
  try {
    let id = req.params.id;
    const data = await UnitModel.deleteOne({ _id: id });

    if (data.deletedCount === 1) {
      return res.json({ success: "Successfully deleted" });
    } else {
      return res.status(404).json({ error: "Unit not found" });
    }
  } catch (error) {
    console.error("Error deleting Unit:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

}

const UnitController = new Unit();
module.exports = UnitController;
