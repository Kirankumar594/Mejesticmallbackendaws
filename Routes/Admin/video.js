const express = require("express");
const router = express.Router();
const videoController=require("../../Controller/Admin/video")
const multer = require("multer");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "/home/parnetsl1b/public_html/Public/video");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post("/addVideo",upload.any(), videoController.addVideo);
router.get("/getAllVideo",videoController.getAllVideo);
router.delete("/deleteVideo/:videoId",videoController.deleteVideo);

module.exports = router;