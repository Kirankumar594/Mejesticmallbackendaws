const express = require("express");
const router = express.Router();
const transportController=require("../../Controller/User/transporter")
const multer = require("multer");
const {Authentication,Authorization}=require("../../Authentication/auth")
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "/home/parnetsl1b/public_html/Public/transport");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post("/registerTransports",upload.any(), transportController.register);
router.put("/editTransports",upload.any(),transportController.editUser);
router.post("/loginTransports",transportController.login);
router.get("/getAllTransports",transportController.getAllUser);
router.get("/getTransportsById/:userId",transportController.getUserById);
router.delete("/deleteTransports/:userId",transportController.deleteUser);
router.post("/transportForgetPwd",transportController.forgetPwd)
module.exports = router;