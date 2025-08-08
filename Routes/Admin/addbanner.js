const express = require("express");
const router = express.Router();
const bannerController = require("../../Controller/Admin/addbanner");
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
  "/addbanner",
 upload.any(),
  bannerController.postaddbanner
);
router.put(
  "/updatebanner/:id",
 upload.any(),
  bannerController.updatebanner
);
router.get("/getallbanner", bannerController.getallbanner);
router.post("/deletebanner/:id", bannerController.postdeletebanner);

module.exports = router;
