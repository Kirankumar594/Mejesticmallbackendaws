const express = require("express");
const router = express.Router();
const checkinController=require("../../Controller/User/checkin")
const multer = require("multer");
const {Authentication,Authorization}=require("../../Authentication/auth")
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "/home/parnetsl1b/public_html/Public/vehicle");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post("/checkin",upload.any(), checkinController.checkin);
router.post("/checkout",upload.any(), checkinController.checkout);

router.get("/getAllCheckin",checkinController.getAllCheckin);
router.get("/getUserCheckin/:userId",checkinController.getuserCheckin);
module.exports = router;