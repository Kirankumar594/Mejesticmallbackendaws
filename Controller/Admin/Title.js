const TitleModel = require("../../Model/Admin/Title");

class Title {
  async addTitle(req, res) {
    let { title } = req.body;
   

    let add = new TitleModel({
      title: title,
     
     
    });
    let save = add.save();
    if (save) {
      
      return res.json({ sucess: "Title added successfully" });
     
    }
  }

  async getTitle(req, res) {
    let Title = await TitleModel.find({}).sort({ _id: -1 });
    if (Title) {
      return res.json({ Title: Title });
    }
  }

  async postTitle(req, res) {
    let { title } = req.body;
    let Title = await TitleModel
      .find({ title })
      .sort({ _id: -1 });
      console.log(Title);
    if (Title) {
      return res.json({ Title: Title });
    }
  }
  async updateTitle(req, res) {
    const id = req.params.id;
    let {title } = req.body;
      let obj = {};
       if (title) {
        obj["title"] = title;
      }
    
   
    
    try {
      await TitleModel
        .findOneAndUpdate(
          { _id: id },
           { $set: obj },
        { new: true }
        )
        
       let user = await TitleModel.findOne({_id:id});
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

 async postdeleteTitle(req, res) {
  try {
    let id = req.params.id;
    const data = await TitleModel.deleteOne({ _id: id });

    if (data.deletedCount === 1) {
      return res.json({ success: "Successfully deleted" });
    } else {
      return res.status(404).json({ error: "Title not found" });
    }
  } catch (error) {
    console.error("Error deleting Title:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

}

const TitleController = new Title();
module.exports = TitleController;
