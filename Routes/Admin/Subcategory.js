const express = require("express");
const router = express.Router();
const SubcategoryController = require("../../Controller/Admin/Subcategory");
const {Authentication,Authorization}=require("../../Authentication/auth")



router.post("/addSubcategory",Authentication ,SubcategoryController.addSubcategory);
router.get("/getSubcategory", SubcategoryController.getSubcategory);
router.post("/postSubcategory",Authentication, SubcategoryController.postSubcategory);
router.get("/changesubcategoryActiveStatus/:subcategoryid", SubcategoryController.changesubcategoryActiveStatus);
router.get("/changesubcategoryInactiveStatus/:subcategoryid", SubcategoryController.changesubcategoryInactiveStatus);
router.delete("/deleteSubcategory/:id",Authentication, SubcategoryController.postdeleteSubcategory);
router.post("/editSubcategory/:id",Authentication, SubcategoryController.updateSubcategory);
module.exports = router;