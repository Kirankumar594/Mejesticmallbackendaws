const express = require("express");
const router = express.Router();
const clubuserController = require("../../Controller/User/clubuser.js");
const multer = require("multer");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "/home/parnetsl1b/public_html/Public/user");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post("/registerclubUser", upload.any(), clubuserController.clubregister);
router.post("/editclubUser", upload.any(), clubuserController.editclubUser);
router.post("/loginclubUser", clubuserController.clublogin);
router.get(
  "/changeclubBlockStatus/:userId",
  clubuserController.changeclubBlockStatus
);
router.get(
  "/changeclubunBlockStatus/:userId",
  clubuserController.changeclubUnBlockStatus
);

router.get("/getAllclubUser", clubuserController.getAllclubUser);
router.get("/getclubUserById/:userId", clubuserController.getclubUserById);
router.delete("/deleteclubUser/:userId", clubuserController.deleteclubUser);
router.post("/clubuserForgetPwd", clubuserController.clubforgetPwd);
module.exports = router;
