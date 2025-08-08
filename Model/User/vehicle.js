const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const {ObjectId}=Schema.Types
const vehicleSchema = new Schema(
      {
        vehicleImage:{
            type:String
        },
        brand:{
            type:String
        },
        mudel:{
            type: String
          },
        capacity:{
            type:Number
        },
        size:{
            type:String
        },
        speed:{
            type:Number
        },
        priceOneKm:{
            type:Number
        },
        number:{
            type:Number
        },
        email:{
            type:String
        },
        time:{
            type:String
        },
        driverName:{
            type:String
        },
        driverImage:{
            type:String
        },
        state:{
            type:String
        },
        city:{
            type:String
        },
        pincode:{
            type:String
        },
        transporterId:{
            type:ObjectId,
            ref:"transport"
        },
        location:{type:String},

        adminId:{
            type:String
        },
        isAvailable:{
            type:Boolean,
            default:false
        }
      },{ timestamps: true });
  
  module.exports= mongoose.model("vehicle", vehicleSchema);
  