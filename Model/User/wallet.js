const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const walletSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",  
      required: true
    },
    balance: {
      type: Number,
      required: true,
      default: 0  
    },
    transactions: [
      {
        transactionId: {
          type: String,
          required: true,
          unique: true 
        },
        date: {
          type: Date,
          default: Date.now  
        },
        detail: {
          type: String,
          required: true 
        },
        credit: {
          type: Number,
          default: 0  
        },
        debit: {
          type: Number,
          default: 0  
        },
        
      }
    ]
  },
  { timestamps: true }  
);


module.exports = mongoose.model("Wallet", walletSchema);
