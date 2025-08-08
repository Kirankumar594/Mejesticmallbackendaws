const express = require("express");
const router = express.Router();
const checkoutController = require("../../Controller/User/checkout");

router.post("/checkout1", checkoutController.checkout1);
router.get("/getcheckout/:userid", checkoutController.getcheckout);
router.get("/getcheckoutAll", checkoutController.getcheckoutAll);


router.post("/deleteorder/:id", checkoutController.deleteorder);




module.exports = router;
