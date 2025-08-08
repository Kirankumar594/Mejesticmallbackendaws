const express = require("express");
const router = express.Router();
const AbandonedController = require("../../Controller/Admin/Abandoned");
const {Authentication,Authorization}=require("../../Authentication/auth")



router.post("/abandoned-cart", AbandonedController.addAbandoned);
router.get("/getAbandoned", AbandonedController.getAbandoned);
router.delete("/deleteAbandoned/:id", AbandonedController.postdeleteAbandoned);
module.exports = router;