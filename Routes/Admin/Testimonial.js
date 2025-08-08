const express = require("express");
const router = express.Router();
const TestimonialController = require("../../Controller/Admin/Testimonial");
const multer = require("multer");
const {Authentication,Authorization}=require("../../Authentication/auth")

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
  "/addTestimonial",Authentication,
  upload.single("profileImage"),
  TestimonialController.addTestimonial
);


router.get("/getTestimonials", TestimonialController.getTestimonial);

router.delete(
  "/deleteTestimonial/:id",Authentication,
  TestimonialController.deleteTestimonial
);


router.post(
  "/editTestimonial/:id",Authentication,
  upload.any(),
  TestimonialController.updateTestimonial
);

module.exports = router;
