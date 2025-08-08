const express = require("express");
const router = express.Router();
const UnitController = require("../../Controller/Admin/Unit");
const {Authentication,Authorization}=require("../../Authentication/auth")
router.post("/addUnit",Authentication, UnitController.addUnit);
router.get("/getUnit",Authentication, UnitController.getUnit);
router.post("/postUnit",Authentication, UnitController.postUnit);
router.delete("/deleteUnit/:id",Authentication, UnitController.postdeleteUnit);
router.post("/editUnit/:id",Authentication, UnitController.updateUnit);
module.exports = router;
