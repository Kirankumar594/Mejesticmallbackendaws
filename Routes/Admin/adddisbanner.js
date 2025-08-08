const express = require("express");
const router = express.Router();
const bannerdiscountController = require("../../Controller/Admin/adddisbanner");
const {Authentication,Authorization}=require("../../Authentication/auth")
const multer = require("multer");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "Public/image");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post(
  "/adddiscountbanner",Authentication,
 upload.any(),
  bannerdiscountController.postadddiscountbanner
);

router.put(
  "/updatediscountbanner/:id",Authentication,
 upload.any(),
  bannerdiscountController.updatediscountbanner
);
router.get("/getalldiscountbanner", bannerdiscountController.getalldiscountbanner);
router.delete("/deletediscountbanner/:id",Authentication, bannerdiscountController.postdeletediscountbanner);


module.exports = router;
