const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema.Types;

const orderSchema = new Schema(
  {
    userId: {
      type: String,
      ref: 'user',
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "product",
        },
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        weight: { type: String, required: true },
        price: { type: Number, required: true },
        selecteddiscount: {
          type: Number, default: 0
        },
        discount: {
          type: Number, default: 0
        },
      },
    ],
    totalAmount: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    selecteddiscount: { type: Number },
    shippingAddress: { type: Object, required: true },
    paymentMethod: {
      type: String,
    },
    orderType: {
      type: String,
    },
    orderDate: { type: Date, default: Date.now },
    additionalInstructions: { type: String },
    status: { type: String, default: "Pending" },
    remarks: { type: String },
    deliveryProof: { type: String },
    otp: { type: String },
    deliveryCharge: {
      type: Number, default: 0
    },
    deliveryDate: { type: Date },
    deliveryBoyId: { type: mongoose.Schema.Types.ObjectId, ref: 'driver', default: null },
  },
  { timestamps: true }
);
module.exports = mongoose.model("order", orderSchema);
