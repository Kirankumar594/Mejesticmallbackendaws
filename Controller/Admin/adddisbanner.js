const bannerdiscountModel = require("../../Model/Admin/adddisbanner");

class banner {
  async postadddiscountbanner(req, res) {
  try {
    let { link } = req.body;
    let obj = { link};

    
    if (req.files && req.files.length !== 0) {
      let arr = req.files;
      let i;

      for (i = 0; i < arr.length; i++) {
        if (arr[i].fieldname === "banner") {
          obj["banner"] = arr[i].filename;
        }
      }
    } else {
      return res.status(400).json({ error: "banner image required" });
    }

    let newbanner = new bannerdiscountModel(obj);
    let save = await newbanner.save();

    if (save) {
      return res.json({ success: "banner added successfully" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
  async updatediscountbanner(req, res) {
  try {
      let id=req.params.id
    let { link } = req.body;
    let obj = { link};

       let newbanner = await bannerdiscountModel.findById(id);
       if(!newbanner) return res.status(400).json({error:"Banner not found"})
       
       if(link){
          newbanner.link=link 
       }
       
    if (req.files && req.files.length !== 0) {
      let arr = req.files;
      let i;

      for (i = 0; i < arr.length; i++) {
        if (arr[i].fieldname === "banner") {
          newbanner.banner = arr[i].filename;
        }
      }
    } 
 
    let save = await newbanner.save();

    if (save) {
      return res.json({ success: "banner updated successfully" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
  async getalldiscountbanner(req, res) {
   
    let banner = await bannerdiscountModel.find({});

    if (banner) {
      return res.json({ banner: banner });
    } else {
      return res.status(403).json({ error: "not able find banner" });
    }
  }

  async postdeletediscountbanner(req, res) {
     try{
          let id = req.params.id;
    const data = await bannerdiscountModel.deleteOne({ _id: id });

    return res.json({ success: "Successfully" });
     }catch(error){
         console.log(error);
         return res.status(500).json({error:error.message})
     }
  }
}

const bannerdiscountController = new banner();
module.exports = bannerdiscountController;
