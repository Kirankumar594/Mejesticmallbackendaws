// routes/deliveryChargeRoutes.js
const express = require('express');
const {
  getAllDeliveryCharges,
  addDeliveryCharge,
  editDeliveryCharge,
  deleteDeliveryCharge,
  activedeactivedeliverymake,
  getactivedelivery
} = require('../../Controller/Admin/Deliverycharges');
const {Authentication,Authorization}=require("../../Authentication/auth")
const router = express.Router();

// Get all delivery charges
router.get('/getalldeliverycharges',Authentication, getAllDeliveryCharges);

// Add a new delivery charge
router.post('/adddeliverycharges', Authentication,addDeliveryCharge);

// Edit an existing delivery charge
router.post('/editdeliverycharges/:id',Authentication, editDeliveryCharge);
router.put('/activedeactivedeliverymake/:id',Authentication, activedeactivedeliverymake);
router.get('/getactivedelivery', getactivedelivery);

// Delete a delivery charge
router.delete('/deletedeliverycharges/:id', Authentication,deleteDeliveryCharge);

module.exports = router;
