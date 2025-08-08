const express = require("express");
const router = express.Router();
const promocodeController = require("../../Controller/Admin/promocode");
const {Authentication,Authorization}=require("../../Authentication/auth")
router.post("/addpromocode",Authentication,  promocodeController.postaddpromocode);
router.post("/editpromocode/:id",Authentication,  promocodeController.posteditpromocode);
router.get("/getallpromocode", Authentication, promocodeController.getallpromocode);
router.delete("/deletepromocode/:id",Authentication,  promocodeController.postdeletepromocode);
router.put("/getCouponBycode",Authentication,  promocodeController.getCouponBycode);
router.post("/checkpromocode",Authentication,  promocodeController.checkpromocode);
router.get("/getavailablecoupons",  promocodeController.getavailablecoupons);


module.exports = router;