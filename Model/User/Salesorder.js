const mongoose = require("mongoose");

const salesOrderSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'order' },
  items: [{
    itemId: mongoose.Schema.Types.ObjectId,
    name: String,
    quantity: Number,
    weight: String,
    price: Number,
  }],
  totalAmount: Number,
  discount: Number,
  status: { type: String, default: "sales_order" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('SalesOrder', salesOrderSchema);
