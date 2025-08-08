const express = require("express");
const router = express.Router();
const TitleController = require("../../Controller/Admin/Title");
const {Authentication,Authorization}=require("../../Authentication/auth")



router.post("/addTitle",Authentication, TitleController.addTitle);
router.get("/getTitle", TitleController.getTitle);
router.post("/postTitle",Authentication, TitleController.postTitle);
router.delete("/deleteTitle/:id",Authentication, TitleController.postdeleteTitle);
router.post("/editTitle/:id",Authentication, TitleController.updateTitle);
module.exports = router;