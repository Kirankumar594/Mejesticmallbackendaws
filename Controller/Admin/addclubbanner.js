const clubbannerModel = require("../../Model/Admin/addclubbanner");

class clubbanner {
  async postaddclubbanner(req, res) {
  try {
    let { type } = req.body;
    let obj = { type};

    
    if (req.files && req.files.length !== 0) {
      let arr = req.files;
      let i;

      for (i = 0; i < arr.length; i++) {
        if (arr[i].fieldname === "clubbanner") {
          obj["clubbanner"] = arr[i].filename;
        }
      }
    } else {
      return res.status(400).json({ error: "clubbanner image required" });
    }

    let newclubbanner = new clubbannerModel(obj);
    let save = await newclubbanner.save();

    if (save) {
      return res.json({ success: "clubbanner added successfully" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

  async getallclubbanner(req, res) {
   
    let clubbanner = await clubbannerModel.find({}).sort({ _id: -1 });

    if (clubbanner) {
      return res.json({ clubbanner: clubbanner });
    } else {
      return res.status(403).json({ error: "not able find clubbanner" });
    }
  }

  async postdeleteclubbanner(req, res) {
    let id = req.params.id;
    const data = await clubbannerModel.deleteOne({ _id: id });

    return res.json({ success: "Successfully" });
  }
}

const clubbannerController = new clubbanner();
module.exports = clubbannerController;
