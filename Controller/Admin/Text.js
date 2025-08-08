const TextModel = require("../../Model/Admin/Text");

class Text {
  async addText(req, res) {
    let { text,category,fromDay, toDay, fromTime, endTime ,deliveryCharge,minOrder,minKm,perKmCharge} = req.body;
   
    // let check=await TextModel.findOne({fromDate:fromDate, toDate:toDate})
    // if(check) return res.status(400).json({error:true,meassage:"Already exits data"})
    let add = new TextModel({
      text: text,category,fromDay, toDay, fromTime, endTime ,deliveryCharge,minOrder,minKm,perKmCharge
    });
    let save = add.save();
    if (save) {
      
      return res.json({ sucess: "Text added successfully" });
     
    }
  }

  async getText(req, res) {
    let Text = await TextModel.find({}).sort({ _id: -1 });
    if (Text) {
      return res.json({ Text: Text });
    }
  }

  async postText(req, res) {
    let { text } = req.body;
    let Text = await TextModel
      .find({ text })
      .sort({ _id: -1 });
      console.log(Text);
    if (Text) {
      return res.json({ Text: Text });
    }
  }
  async updateText(req, res) {
    const id = req.params.id;
    let {text ,category,fromDay, toDay, fromTime, endTime ,deliveryCharge,minOrder,minKm,perKmCharge} = req.body;
      let obj = {category,fromDay, toDay, fromTime, endTime ,deliveryCharge,minOrder,minKm,perKmCharge};
       if (text) {
        obj["text"] = text;
      }
    
   
    
    try {
      await TextModel
        .findOneAndUpdate(
          { _id: id },
           { $set: obj },
        { new: true }
        )
        
       let user = await TextModel.findOne({_id:id});
       if(user){
           return res.status(200).json({success:"success"})
       }
       else{
           return res.status(400).json({error:"error"})
       }
    } catch (err) {
      console.log(err);
    }
  }

 async postdeleteText(req, res) {
  try {
    let id = req.params.id;
    const data = await TextModel.deleteOne({ _id: id });

    if (data.deletedCount === 1) {
      return res.json({ success: "Successfully deleted" });
    } else {
      return res.status(404).json({ error: "Text not found" });
    }
  } catch (error) {
    console.error("Error deleting Text:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
async makeactivedeactivetext(req,res){
    try{
        let {id}=req.params;
     
        let data=await TextModel.findById(id);
        if(!data) return res.status(400).json({error:'Data not found'});
        if(data.isActive==true){
            data.isActive=false
        }else{
             data.isActive=true
        }
        
        data=await data.save()
        return res.status(200).json({success:`Successfully updated`})
    }catch(error){
        console.log(error)
    }
}
async getActiveText(req,res){
    try{
        let data=await TextModel.findOne({isActive:true});
        res.status(200).json({data:data})
    }catch (error) {
    console.error("Error deleting Text:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

}

const TextController = new Text();
module.exports = TextController;
