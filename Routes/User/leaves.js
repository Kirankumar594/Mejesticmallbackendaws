const express = require("express");
const router = express.Router();
const leavesController=require("../../Controller/User/leaves")
const multer = require("multer");
const {Authentication,Authorization}=require("../../Authentication/auth")
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "/home/parnetsl1b/public_html/Public/leaves");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post("/addLeaves", leavesController.addLeaves);

router.post("/changeleavesStatus", leavesController.changeleavesStatus);

router.get("/getAllleaves", leavesController.getAllleaves);
router.get("/getleavesByUserId/:userId", leavesController.getleavesByUserId);
router.get('/leaveNotifications/:userId', leavesController.getLeaveNotifications);
router.delete("/deleteleaves/:leavesId", leavesController.deleteleaves);
module.exports = router;