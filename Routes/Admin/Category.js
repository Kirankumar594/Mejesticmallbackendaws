const express = require("express");
const router = express.Router();
const CategoryController = require("../../Controller/Admin/Category");
const multer = require("multer");
const {Authentication,Authorization}=require("../../Authentication/auth")
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "Public/image");
    },
    
    filename: function (req, file, cb) {
           const sanitizedOriginalName = file.originalname.replace(/\s+/g, "_");
      cb(null, Date.now() + "_" + sanitizedOriginalName);
    },
  });
  
  const upload = multer({ storage: storage });




router.post("/addCategory",Authentication, upload.single("categoryimage"), CategoryController.addCategory);
router.get("/getCategory", CategoryController.getCategory);
router.get("/getallCategory", CategoryController.getallCategory);
router.get("/changecategoryActiveStatus/:categoryid", CategoryController.changecategoryActiveStatus);
router.get("/changecategoryInactiveStatus/:categoryid", CategoryController.changecategoryInactiveStatus);
router.delete("/deleteCategory/:id",Authentication, CategoryController.postdeleteCategory);
router.post("/editCategory/:id",Authentication, upload.any(), CategoryController.updateCategory);
router.get('/getAllCategoriesWithSubcategories', CategoryController.getAllCategoriesWithSubcategories);


module.exports = router;