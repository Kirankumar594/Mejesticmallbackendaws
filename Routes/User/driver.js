const express = require("express");
const router = express.Router();
const driverController = require("../../Controller/User/driver");
const driverModel = require("../../Model/User/driver");
const multer = require("multer");
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'Public/driver');
  },
  filename: function (req, file, cb) {
    // Create unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|jfif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed!'));
  }
});

router.post('/addDoc', upload.fields([
  { name: 'aadharFront', maxCount: 1 },
  { name: 'aadharBack', maxCount: 1 },
  { name: 'panImage', maxCount: 1 },
  { name: 'dlImage', maxCount: 1 }
]), driverController.addDoc);
router.post('/registerdriver', driverController.registerdriver);
router.put("/editdriver", upload.any(), driverController.editdriver);
router.post("/logindriver", driverController.sendOTP);
router.post("/verifyotp", driverController.logindriver);
router.get("/getAlldriver", driverController.getAlldriver);
router.get("/changedriverBlockStatus/:userId",driverController.changedriverBlockStatus);

router.get("/changedriverunBlockStatus/:userId",driverController.changedriverunBlockStatus);
router.get("/my-orders", driverController.getMyOrders);
router.get("/getdriverById/:userId", driverController.getdriverById);
router.delete("/deletedriver/:userId", driverController.deletedriver);
router.post("/driverForgetPwd", driverController.forgetPwd);

module.exports = router;
