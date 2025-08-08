const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const weightSchema = new mongoose.Schema({
  value: {
    type: String,
    
  },
  price: {
    type: String,
    
  },
  units: {
    type: String,
    
  },
   stock: {
    type: String,
    
  },
minStock:  {
    type: String,
     default: 0,
    
  },
  id: {
    type: String,
    
    unique: true, 
  },
});
const ClubweightSchema = new mongoose.Schema({
  value: {
    type: String,
    
  },
  price: {
    type: String,
    
  },
  units: {
    type: String,
    
  },
   stock: {
    type: String,
    
  },
minStock:  {
    type: String,
     default: 0,
    
  },
  id: {
    type: String,
    
    unique: true, 
  },
});
const productSchema = new Schema(
  {
    productname: {
      type: String,
    },
    category: {
      type: String,
    },

    subcategory: {
      type: String,
    },

    tag: {
      type: String,
    },

    description: {
      type: String,
    },

    subscribe: {
      type: String,
    },
    price: {
      type: Number,
    },

    discount: {
      type: Number,
      default: 0,
    },
   
    unit: {
      type: String,
    },
    miniunit: {
      type: String,
    },
    ministock: {
      type: Number,
      default: 0,
    },
    clubdiscount: {
      type: Number,
      default: 0,
    },
    sellproduct:{
        type: Number,
      default: 0,
    },
    stock: {
      type: Number,
      default: 0,
    },
    stock_history:[{
        stockName: String,
        previousStock: Number,
        addedStock: Number,
        newStock: Number,
        date: { type: Date, default: Date.now },
    }],
    offerPrice: {
      type: Number,
      default: 0,
    },
    weight: [weightSchema],
    Clubweight: [ClubweightSchema],

    Photos: [
      {
        file: { type: String },
      },
    ],
    status:{
      type:String,
      default:"Active"
  },
  bestsellerstatus: {
    type: Boolean,
    default: false,
  },
  },
  { timestamps: true }
);

const productModel = mongoose.model("product", productSchema);
module.exports = productModel;
