const express = require("express");
const router = express.Router();
const productController = require("../../Controller/Admin/product");
const multer = require("multer");
const {Authentication,Authorization}=require("../../Authentication/auth")
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "Public/product");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});
var storage1 = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "Public/product");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });
const upload1 = multer({ storage: storage1 });

router.post("/addProduct",Authentication,  productController.addProduct);
router.post("/addPhotos",Authentication, upload.any(),productController.addPhotos);
router.delete('/removePhotos/:id/:removeId',Authentication, productController.removePhotos);
router.delete('/removeWeight/:id/:removeId',Authentication, productController.removeWeight);
router.delete('/removeClubWeight/:id/:removeId',Authentication, productController.removeClubWeight);
router.post(
  "/productimage",Authentication, 
  upload1.any(),
  productController.postproductimage
);
router.put(
  "/addStockPoduct",Authentication, 
  productController.addStockPoduct
);

router.post(
  "/addmultiproduct",Authentication, 
  productController.postaddmultiproduct
);
router.get("/changeActiveStatus/:productid", productController.changeActiveStatus);
router.get("/changeInactiveStatus/:productid", productController.changeInactiveStatus);
router.get("/Getproductlist",  productController.getMarketProductList);
router.get("/getProductById/:productid",  productController.getProductById);
router.get("/getProductByCategory/:id",  productController.getProductByCategory);
router.get("/getProductByBrand",Authentication,  productController.getProductByBrand);
router.delete("/deleteProduct/:productid",Authentication,  productController.deleteProductById);
router.post("/updateProduct/:productid",Authentication, upload.any(),productController.UpdateProduct);
router.post("/addAndUpadateRating",Authentication, productController.addAndUpadateRating);
router.get("/addbestseller/:id",Authentication,  productController.addbestseller);
router.get("/removebestseller/:id",Authentication,  productController.removebestseller);
module.exports = router;
