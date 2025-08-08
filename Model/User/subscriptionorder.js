
const mongoose = require("mongoose");

const SubscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
    },
    walletId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Wallet",
    },
    frequency: { type: String, },
    quantity: { type: Number, },
    startDate: { type: Date, },
    endDate: { type: Date },
    lastOrderDate:{type: Date},
    totalOrders: { type: Number, },
    totalQuantity: { type: Number, },
    productValue: { type: Number, },
    discount: { type: Number, },
    subtotal: { type: Number, },
    deliveryCharges: { type: Number, },
    total: { type: Number, },
    shippingAddress: { type: Object, required: true },
    dayQuantities: {
      Sunday: Number,
      Monday: Number,
      Tuesday: Number,
      Wednesday: Number,
      Thursday: Number,
      Friday: Number,
      Saturday: Number,
    },
    deliveryData:[{
       driverName:{type:String},
       driverNumber:{type:Number},
       date:{type:String},
       deliveryType:{type:String},
       proofImg:{type:String},
       remarks:{type:String},
       status:{type:String,defaul:"Pending"},
       
    }],
    nthInterval: { type: Number },
    selectedWeight: {
        value: Number,
        units: String,
        price:Number,
      },
      status:{
        type:String,
        default:"pending"
    },
    remarks: { type: String },
    deliveryProof: { type: String },
    otp: { type: String },
    deliveryDate: { type: Date },
    
    pauseDates: [Date],
    deliveryBoyId: { type: mongoose.Schema.Types.ObjectId, ref: 'driver', default: null }, 
  },
  { timestamps: true }
);

module.exports = mongoose.model("Subscription", SubscriptionSchema);
