const express = require("express");
const router = express.Router();
const TagController = require("../../Controller/Admin/Tag");
const {Authentication,Authorization}=require("../../Authentication/auth")



router.post("/addTag",Authentication, TagController.addTag);
router.get("/getTag",Authentication, TagController.getTag);
router.post("/postTag",Authentication, TagController.postTag);
router.delete("/deleteTag/:id",Authentication, TagController.postdeleteTag);
router.post("/editTag/:id",Authentication, TagController.updateTag);
module.exports = router;