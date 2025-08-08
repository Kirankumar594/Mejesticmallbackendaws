const bannerModel = require("../../Model/Admin/addbanner");

class banner {
  async postaddbanner(req, res) {
  try {
    let { type } = req.body;
    let obj = { type};

    
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

    let newbanner = new bannerModel(obj);
    let save = await newbanner.save();

    if (save) {
      return res.json({ success: "banner added successfully" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
  async updatebanner(req, res) {
  try {
      let id=req.params.id;
      
    let { type } = req.body;
    let obj = { type};
    let newbanner = await bannerModel.findById(id);
    if(!newbanner) return res.status(400).json({error:"Banner not found"})
    
    if(type){
        newbanner.type=type
    }
    if (req.files && req.files.length !== 0) {
      let arr = req.files;
      let i;

      for (i = 0; i < arr.length; i++) {
        if (arr[i].fieldname === "banner") {
          newbanner["banner"] = arr[i].filename;
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
  async getallbanner(req, res) {
   
    let banner = await bannerModel.find({});

    if (banner) {
      return res.json({ banner: banner });
    } else {
      return res.status(403).json({ error: "not able find banner" });
    }
  }

  async postdeletebanner(req, res) {
    let id = req.params.id;
    const data = await bannerModel.deleteOne({ _id: id });

    return res.json({ success: "Successfully" });
  }
}

const bannerController = new banner();
module.exports = bannerController;
