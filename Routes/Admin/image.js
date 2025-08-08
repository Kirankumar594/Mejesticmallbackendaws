const express = require("express");
const router = express.Router();
const imageController=require("../../Controller/Admin/image")
const multer = require("multer");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "/Public/image");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post("/addImage",upload.any(), imageController.addImage);
router.get("/getAllImage",imageController.getAllImage);
router.delete("/deleteImage/:imageId",imageController.deleteImage);

module.exports = router;