const SubcategoryModel = require("../../Model/Admin/Subcategory");
const CategoryModel = require("../../Model/Admin/Category");

class Subcategory {
  async addSubcategory(req, res) {
    try {
      let { categoryId, SubcategoryName } = req.body;
      
      // Verify category exists
      const categoryExists = await CategoryModel.findById(categoryId);
      if (!categoryExists) {
        return res.status(404).json({ error: "Category not found" });
      }

      let add = new SubcategoryModel({
        categoryId: categoryId,
        SubcategoryName: SubcategoryName,
      });
      
      await add.save();
      return res.json({ success: "Subcategory added successfully" });
    } catch (error) {
      console.error("Error adding subcategory:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async getSubcategory(req, res) {
    try {
      let subcategories = await SubcategoryModel.find({}).sort({ _id: -1 });
      return res.json({ Subcategory: subcategories });
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
async changesubcategoryActiveStatus(req, res) {
    try {
      let subcategory = req.params.subcategoryid;

      const data = await SubcategoryModel.findOneAndUpdate(
        { _id: subcategory },
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
  async changesubcategoryInactiveStatus(req, res) {
    try {
      let subcategory = req.params.subcategoryid;
      const data = await SubcategoryModel.findOneAndUpdate(
        { _id: subcategory },
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
  async postSubcategory(req, res) {
    try {
      let { categoryId } = req.body;
      let subcategories = await SubcategoryModel
        .find({ categoryId })
        .sort({ _id: -1 });
      return res.json({ Subcategory: subcategories });
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async updateSubcategory(req, res) {
    try {
      const id = req.params.id;
      let { categoryId, SubcategoryName } = req.body;
      
      // Verify category exists
      if (categoryId) {
        const categoryExists = await CategoryModel.findById(categoryId);
        if (!categoryExists) {
          return res.status(404).json({ error: "Category not found" });
        }
      }

      let updateObj = {};
      if (categoryId) updateObj.categoryId = categoryId;
      if (SubcategoryName) updateObj.SubcategoryName = SubcategoryName;

      const updated = await SubcategoryModel.findByIdAndUpdate(
        id,
        { $set: updateObj },
        { new: true }
      );

      if (updated) {
        return res.json({ success: "Successfully updated" });
      } else {
        return res.status(404).json({ error: "Subcategory not found" });
      }
    } catch (error) {
      console.error("Error updating subcategory:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async postdeleteSubcategory(req, res) {
    try {
      let id = req.params.id;
      const data = await SubcategoryModel.deleteOne({ _id: id });
      if (data.deletedCount === 1) {
        return res.json({ success: "Successfully deleted" });
      } else {
        return res.status(404).json({ error: "Subcategory not found" });
      }
    } catch (error) {
      console.error("Error deleting subcategory:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}

const SubcategoryController = new Subcategory();
module.exports = SubcategoryController;