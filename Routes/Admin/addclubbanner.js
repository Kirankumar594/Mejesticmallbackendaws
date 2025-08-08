const express = require("express");
const router = express.Router();
const clubbannerController = require("../../Controller/Admin/addclubbanner");
const { Authentication, Authorization } = require("../../Authentication/auth")
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
  "/addclubbanner", Authentication,
  upload.any(),
  clubbannerController.postaddclubbanner
);
router.get("/getallclubbanner", clubbannerController.getallclubbanner);
router.post("/deleteclubbanner/:id", Authentication, clubbannerController.postdeleteclubbanner);

module.exports = router;
