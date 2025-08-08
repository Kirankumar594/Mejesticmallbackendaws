const express = require('express');
const multer = require('multer');
  
const router = express.Router();
const { getProfile, updateProfile, deleteLogo } = require('../../Controller/Admin/BusinessProfile');

const {Authentication,Authorization}=require("../../Authentication/auth");

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "/home/parnetsl1b/public_html/Public/profile");
    },
    
    filename: function (req, file, cb) {
           const sanitizedOriginalName = file.originalname.replace(/\s+/g, "_");
      cb(null, Date.now() + "_" + sanitizedOriginalName);
    },
  });
  
  const upload = multer({ storage: storage });




// Routes
router.get('/getbussinessprofile', getProfile);
router.post('/uploadbusineess', Authentication,upload.any(), updateProfile);
router.delete('/deletelogo',Authentication, deleteLogo);

module.exports = router;
