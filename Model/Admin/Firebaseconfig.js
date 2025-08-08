const mongoose = require("mongoose");

const firebaseConfigSchema = mongoose.Schema(
  {
    apiKey: {
      type: String,
    },
    authDomain: {
      type: String,
    },
    
    projectId: {
      type: String,
    },
    
     storageBucket: {
      type: String,
    },
    messagingSenderId:{
      type: String,
    },
     appId:{
      type: String,
    },
    measurementId:{
      type: String,
    },
    vapidKey:{
       type: String,
    },
    googleApi:{
       type: String,
    },
    jwtKey:{
       type: String,
    },
    cryptoKey:{
       type: String,
    },
    isActive:{
        type:Boolean,
        default:true
    }
  },
  { timeStraps: true }
);

const TextModel = mongoose.model("firebaseconfig", firebaseConfigSchema);
module.exports = TextModel;
