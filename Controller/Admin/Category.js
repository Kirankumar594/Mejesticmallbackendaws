const categoryModel = require("../../Model/Admin/Category");
const SubcategoryModel = require("../../Model/Admin/Subcategory");

class category {
    
    async ensurePredefinedCategories() {
    const predefinedCategories = [
      { categoryName: "Grocery & Staples", status: "Active" },
      { categoryName: "Milk & Dairy Products", status: "Active" },
      { categoryName: "Fruits & Vegetables", status: "Active" },
    ];

    try {
      for (const category of predefinedCategories) {
        const existingCategory = await categoryModel.findOne({ categoryName: category.categoryName });
        if (!existingCategory) {
          await categoryModel.create(category);
          console.log(`Category "${category.categoryName}" created.`);
        }
      }
    } catch (error) {
      console.error("Error ensuring predefined categories:", error);
    }
  }
    
  async addCategory(req, res) {
    let { categoryName } = req.body;
  let file = req.file ? req.file.filename : null;

    // Sanitize the file name
    if (file) {
      file = file.replace(/\s+/g, "_");
      console.log("Sanitized file name:", file);
    }
const existingCategory = await categoryModel.findOne({ categoryName: categoryName });
   if (existingCategory) {
      return res.status(400).json({ sucess: "Category already exits" });
    }
    
    let add = new categoryModel({      
      categoryName: categoryName,
       categoryimage: file,
     
    });
    
    let save = add.save();
    if (save) {
      return res.json({ sucess: "category name added successfully" });
    }
  }

  async getCategory(req, res) {
    let category = await categoryModel.find({}).sort({ createdAt: -1 });
    if (category) {
      return res.json({ category: category });
    }
  }

  async getallCategory(req, res) {
    let category = await categoryModel.aggregate([
      {
        $lookup: {
          from: "subcategories",
          localField: "categoryName",
          foreignField: "categoryName",
          as: "subcategories",
        },
      },
    ]).sort({ createdAt: -1 });
    if (category) {
      return res.json({ category: category });
    }
  }
async updateCategory(req, res) {
  const id = req.params.id;
    let { categoryName } = req.body;
      let obj = {};
       if (categoryName) {
        obj["categoryName"] = categoryName;
      }
      
      
     if (req.files.length != 0) {
        let arr = req.files;
        let i;
        for (i = 0; i < arr.length; i++) {
          if (arr[i].fieldname == "categoryimage") {
            obj["categoryimage"] = arr[i].filename;
          }
         
        }
      }
    try {
      await categoryModel
        .findOneAndUpdate(
          { _id: id },
           { $set: obj },
        { new: true }
        )
        
       let user = await categoryModel.findOne({_id:id});
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

 async postdeleteCategory(req, res) {
  try {
    const id = req.params.id;
     const predefinedCategories = [
        "Grocery & Staples",
        "Milk & Dairy Products",
        "Fruits & Vegetables",
      ];
          const category = await categoryModel.findById(id);

      if (predefinedCategories.includes(category.categoryName)) {
        return res.status(403).json({
          error: "Predefined categories cannot be deleted.",
        });
      }
      
    const data = await categoryModel.deleteOne({ _id: id });

    if (data.deletedCount === 1) {
      return res.json({ success: "Successfully deleted" });
    } else {
      return res.status(404).json({ error: "Category not found" });
    }
  } catch (error) {
    console.error("Error deleting category:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
async changecategoryActiveStatus(req, res) {
    try {
      let category = req.params.categoryid;

      const data = await categoryModel.findOneAndUpdate(
        { _id: category },
        { status: "Inactive" }
      );
      if (!data) {
        return res.status(403).json({
          error: "Cannot able to find the user",
        });
      } else {
        return res.json({ success: "Blocked Successful" });
      }
    } catch (err) {
      console.log(err);
    }
  }
  async changecategoryInactiveStatus(req, res) {
    try {
      let category = req.params.categoryid;
      const data = await categoryModel.findOneAndUpdate(
        { _id: category },
        { status: "Active" }
      );
      if (!data) {
        return res.status(403).json({
          error: "Cannot able to find the user",
        });
      } else {
        return res.json({ success: "Approved Successful" });
      }
    } catch (err) {
      console.log(err);
    }
  }


  async getAllCategoriesWithSubcategories   (req, res) {
    try {
      const categories = await categoryModel.find();
      const subcategories = await SubcategoryModel.find();
  
      const combined = categories.map(cat => ({
        ...cat._doc,
        subcategories: subcategories.filter(sub => sub.categoryId.toString() === cat._id.toString())
      }));
  
      res.json({ success: true, data: combined });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  };


}





const CategoryController = new category();
CategoryController.ensurePredefinedCategories();
module.exports = CategoryController;
