const express = require("express");
const router = express.Router();
const phonepayController=require("../../Controller/User/Phonepay.js")
const {Authentication,Authorization}=require("../../Authentication/auth")

router.post("/addPaymentPhone",Authentication,  phonepayController.addPaymentPhone);
router.post("/payment-callback",  phonepayController.paymentcallback);
router.get("/checkpaymentstatus/:id/:userId",  phonepayController.checkPayment);
router.get("/getallpayment",Authentication,  phonepayController.getallpayment);

module.exports = router;