const TagModel = require("../../Model/Admin/Tag");

class Tag {
  async addTag(req, res) {
    let { tag } = req.body;
   

    let add = new TagModel({
      tag: tag,
     
     
    });
    let save = add.save();
    if (save) {
      
      return res.json({ sucess: "Tag added successfully" });
     
    }
  }

  async getTag(req, res) {
    let Tag = await TagModel.find({}).sort({ _id: -1 });
    if (Tag) {
      return res.json({ Tag: Tag });
    }
  }

  async postTag(req, res) {
    let { tag } = req.body;
    let Tag = await TagModel
      .find({ tag })
      .sort({ _id: -1 });
      console.log(Tag);
    if (Tag) {
      return res.json({ Tag: Tag });
    }
  }
  async updateTag(req, res) {
    const id = req.params.id;
    let {tag } = req.body;
      let obj = {};
       if (tag) {
        obj["tag"] = tag;
      }
    
   
    
    try {
      await TagModel
        .findOneAndUpdate(
          { _id: id },
           { $set: obj },
        { new: true }
        )
        
       let user = await TagModel.findOne({_id:id});
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

 async postdeleteTag(req, res) {
  try {
    let id = req.params.id;
    const data = await TagModel.deleteOne({ _id: id });

    if (data.deletedCount === 1) {
      return res.json({ success: "Successfully deleted" });
    } else {
      return res.status(404).json({ error: "Tag not found" });
    }
  } catch (error) {
    console.error("Error deleting Tag:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

}

const TagController = new Tag();
module.exports = TagController;
