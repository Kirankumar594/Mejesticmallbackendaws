const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema.Types;

const checkout = new Schema(
  {
    userid: {
      type: ObjectId,
    },
    price: {
      type: Number,
    },
    productid: {
      type: ObjectId,
    },
    date: {
      type: String,
    },
    quantity: {
      type: Number,
    },
    
    productname: {
      type: String,
    },
    
    offerprice: {
      type: String,
    },
    mobile: {
      type: String,
    },
    
    amount: {
      type: String,
    },
    tax: {
      type: Number,
    },
    

    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    
    country: {
      type: String,
    },
    address: {
      type: String,
    },
    city: {
      type: String,
    },

    state: {
      type: String,
    },
    pinCode: {
      type: Number,
    },
   
    email: {
      type: String,
    },
    productdescription: {
      type: String,
    },
    category1: { type: String },
    productmodel: { type: String },
  productbrand: { type: String },
    status : {
      type:String,
      default:"Booked"
    }
  },
  { timestamps: true }
);

const checkoutModel = mongoose.model("checkout", checkout);
module.exports = checkoutModel;
