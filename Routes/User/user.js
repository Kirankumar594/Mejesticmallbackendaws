const express = require("express");
const router = express.Router();
const userController=require("../../Controller/User/user")
const multer = require("multer");
const {Authentication,Authorization}=require("../../Authentication/auth")
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "/home/parnetsl1b/public_html/Public/user");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post("/registerUser", userController.register);
router.post("/editUser",userController.editUser);
router.post("/loginUser",userController.login);
router.get("/changeBlockStatus/:userId",userController.changeBlockStatus);
router.post("/changeClubStatus/:userId",userController.changeClubStatus);

router.get("/changeunBlockStatus/:userId",userController.changeUnBlockStatus);

router.get("/getAllUser",Authentication, userController.getAllUser);
router.get("/getUserById/:userId",userController.getUserById);
router.delete("/deleteUser/:userId",userController.deleteUser);
router.post("/userForgetPwd",userController.forgetPwd);
router.post("/userotpverify",userController.verifyOtp);

module.exports = router;