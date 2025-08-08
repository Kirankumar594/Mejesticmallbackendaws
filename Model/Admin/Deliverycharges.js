// models/DeliveryCharge.js
const mongoose = require('mongoose');

const deliveryChargeSchema = new mongoose.Schema({
  minAmount: {
    type: Number,
    required: true,
  },
  deliveryCharges: {
    type: Number,
    required: true,
  },
   minKm: {
    type: Number,
    default:0
    
  },
  perKmPrice: {
    type: Number,
    required: true,
  },
    isActive: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('DeliveryCharge', deliveryChargeSchema);
