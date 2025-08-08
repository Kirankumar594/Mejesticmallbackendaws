const express = require("express");
const router = express.Router();
const FireconfigController = require("../../Controller/Admin/Firebaseconfig");
const {Authentication,Authorization}=require("../../Authentication/auth")



router.post("/addfirebaseconfig", Authentication,FireconfigController.addfirebaseconfig);
router.get("/getfirebaseconfig",FireconfigController.getfirebaseconfig);

router.delete("/postdeleteFirese/:id",Authentication, FireconfigController.postdeleteFirese);
router.put("/makeactivedfirebase/:id",Authentication, FireconfigController.makeactivedfirebase);
module.exports = router;