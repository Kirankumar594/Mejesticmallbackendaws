const express = require("express");
const router = express.Router();
const otpController=require("../../Controller/User/otp")
const {Authentication,Authorization}=require("../../Authentication/auth")

router.post("/sendotp",  otpController.sendOtp);
router.post("/smsverifyotp",  otpController.verifyotp);
router.post("/sendwithsmsotp",  otpController.sendSMSOtp);
module.exports = router;