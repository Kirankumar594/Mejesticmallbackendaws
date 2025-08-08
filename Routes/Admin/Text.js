const express = require("express");
const router = express.Router();
const TextController = require("../../Controller/Admin/Text");
const {Authentication,Authorization}=require("../../Authentication/auth")



router.post("/addText", Authentication,TextController.addText);
router.get("/getText",TextController.getText);
router.get("/getActiveText",TextController.getActiveText);
router.put("/makeactivedeactivetext/:id",Authentication,TextController.makeactivedeactivetext);
router.post("/postText",Authentication, TextController.postText);
router.delete("/deleteText/:id",Authentication, TextController.postdeleteText);
router.put("/editText/:id",Authentication, TextController.updateText);
module.exports = router;