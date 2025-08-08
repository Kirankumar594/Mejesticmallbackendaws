const express = require("express");
const router = express.Router();
const shippingAddController=require('../../Controller/User/address')
const multer = require("multer");
const {Authentication,Authorization}=require("../../Authentication/auth")
router.post("/addaddress",Authentication,  shippingAddController.addShippingAddress);
router.get("/getaddress",Authentication, shippingAddController.getallShippingAdd);
router.get("/address/:id", Authentication , shippingAddController.geShippingAddByUser);

router.put("/editAddress",Authentication, shippingAddController.editShippingAddress);
router.delete("/deleteaddress/:id",Authentication, shippingAddController.deleteShippingAdd);
router.get("/getAddressById/:addressId",Authentication, shippingAddController.getshippingAddById);
module.exports = router;