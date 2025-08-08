const express = require("express");
const router = express.Router();
const FruitsController = require("../../Controller/Admin/fruits");
const multer = require("multer");
const {Authentication,Authorization}=require("../../Authentication/auth")
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "/home/parnetsl1b/public_html/Public/product");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});
var storage1 = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "/home/parnetsl1b/public_html/Public/product");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });
const upload1 = multer({ storage: storage1 });

router.post("/addfruits",Authentication, FruitsController.addfruits);
router.post("/addfruitsPhotos", upload.any(),Authentication,  FruitsController.addfruitsPhotos);
router.delete(
  "/removefruitsPhotos/:id/:removeId",Authentication, 
  FruitsController.removefruitsPhotos
);
router.delete(
  "/removefruitsWeight/:id/:removeId",Authentication, 
  FruitsController.removefruitsWeight
);
router.delete(
  "/removefruitsClubWeight/:id/:removeId",Authentication, 
  FruitsController.removefruitsClubWeight
);
router.post("/fruitsimage",Authentication,  upload1.any(), FruitsController.postfruitsimage);
router.post("/addmultifruits",Authentication,  FruitsController.postaddmultifruits);
router.get(
  "/changefruitsActiveStatus/:fruitsid", 
  FruitsController.changefruitsActiveStatus
);
router.get(
  "/changefruitsInactiveStatus/:fruitsid", 
  FruitsController.changefruitsInactiveStatus
);
router.get("/Getfruitslist", FruitsController.getMarketfruitsList);
router.get("/getfruitsById/:fruitsid", FruitsController.getfruitsById);
router.get("/getfruitsByCategory",Authentication,  FruitsController.getfruitsByCategory);
router.get("/getfruitsByBrand",Authentication,  FruitsController.getfruitsByBrand);
router.delete("/deletefruits/:fruitsid", Authentication, FruitsController.deletefruitsById);
router.post(
  "/updatefruits/:fruitsid",Authentication, 
  upload.any(),
  FruitsController.Updatefruits
);
router.get("/addfruitsbestseller/:id",Authentication,  FruitsController.addfruitsbestseller);
router.get(
  "/removefruitsbestseller/:id",Authentication, 
  FruitsController.removefruitsbestseller
);

router.get(
  "/addStockfruitPoduct",Authentication, 
  FruitsController.addStockPoduct
);
module.exports = router;
