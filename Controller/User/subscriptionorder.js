
const Subscription = require("../../Model/User/subscriptionorder");
const driverModel = require('../../Model/User/driver');
const walletModel = require('../../Model/User/wallet');
const mongoose = require("mongoose");
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const otpModel = require("../../Model/User/otp");
const moment = require("moment");
// Configure storage for delivery proof images
const deliveryStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = '/Public/driver';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, `delivery_${Date.now()}${path.extname(file.originalname)}`);
  }
});

const deliveryUpload = multer({ 
  storage: deliveryStorage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error('Only image files are allowed!'));
    }
    cb(null, true);
  }
}).single('deliveryProof');




exports.processSubscriptions = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize the date for comparison
    console.log("Processing subscriptions for today:", today);

    // Fetch active subscriptions
    const subscriptions = await Subscription.find({
      status: "Approved", // Only process "Approved" subscriptions
    })
      .populate("deliveryBoyId")
      .populate("productId");

    console.log("Total subscriptions found:", subscriptions.length);

    for (const subscription of subscriptions) {
      // Skip if the start date is in the future
      if (subscription.startDate > today) {
        console.log(
          `Skipping subscription ${subscription._id}, start date is in the future: ${subscription.startDate}`
        );
        continue;
      }

      // Pause subscription if the end date has passed
      if (subscription.endDate && new Date(subscription.endDate) < today) {
        subscription.status = "paused";
        subscription.remarks = "Subscription ended";
        await subscription.save();
        console.log(
          `Subscription ${subscription._id} paused as end date has passed: ${subscription.endDate}`
        );
        continue;
      }

      const lastOrderDate = subscription.lastOrderDate || subscription.startDate;
      const nthIntervalDays = subscription.nthInterval || 1;
      const nextOrderDate = new Date(lastOrderDate);
      nextOrderDate.setDate(nextOrderDate.getDate() + nthIntervalDays); // Calculate next order date

      // Skip if the subscription is not due for processing today
      if (
        subscription.frequency === "On Interval" &&
        nextOrderDate > today
      ) {
        console.log(
          `Skipping subscription ${subscription._id}, next order date is ${nextOrderDate}`
        );
        continue;
      }

      // Check if the subscription has already been processed today
      const isAlreadyProcessed = subscription.deliveryData.some(
        (ele) => moment(ele.date, "DD/MM/YYYY").toDate().getTime() === today.getTime()
      );

      if (isAlreadyProcessed) {
        console.log(
          `Subscription ${subscription._id} already processed for today`
        );
        continue;
      }

      // Check wallet balance
      const wallet = await walletModel.findOne({ userId: subscription.userId });

      if (!wallet) {
        console.log(`Wallet not found for user ${subscription.userId}`);
        continue;
      }

      // Pause subscription if wallet balance is insufficient
      if (wallet.balance < subscription.productValue) {
        subscription.status = "paused";
        subscription.remarks = "Paused due to insufficient funds";
        await subscription.save();
        console.log(
          `Subscription ${subscription._id} paused due to low balance`
        );
        continue;
      }

      // Add delivery data for today
      subscription.deliveryData.push({
        driverName: subscription?.deliveryBoyId
          ? subscription?.deliveryBoyId?.name
          : "Auto assigned",
        driverNumber: subscription?.deliveryBoyId
          ? subscription?.deliveryBoyId?.mobile
          : null,
        date: moment().format("DD/MM/YYYY"),
        deliveryType: "Scheduled",
        proofImg: null,
        status: "Pending",
      });

      // Deduct wallet balance
      wallet.balance -= subscription.productValue;

      // Log transaction in WalletTransaction model
      const transaction = {
        transactionId: new mongoose.Types.ObjectId().toString(),
        credit: 0,
        debit: subscription.productValue,
        detail: `Subscription charge for ${subscription?.productId?.productname}`,
      };
      wallet.transactions.push(transaction);

      // Save wallet and subscription
      await wallet.save();
      subscription.lastOrderDate = today;
      await subscription.save();

      console.log(
        `Subscription ${subscription._id} processed, order created successfully`
      );
    }
  } catch (error) {
    console.log("Error processing subscriptions:", error);
  }
};

exports.createSubscription = async (req, res) => {
  try {
    const {
      userId,
      productId,
      frequency,
      quantity,
      startDate,
      endDate,
      totalOrders,
      totalQuantity,
      productValue,
      discount,
      subtotal,
      deliveryCharges,
      total,
      shippingAddress,
      dayQuantities,
      selectedWeight,
      nthInterval,
      status,
      walletId
    } = req.body;

    const newSubscription = new Subscription({
      userId,
      productId,
      frequency,
      quantity,
      startDate,
      endDate,
      totalOrders,
      totalQuantity,
      productValue,
      discount,
      subtotal,
      deliveryCharges,
      selectedWeight,
      total,
      shippingAddress,
      dayQuantities,
      nthInterval,
      status,walletId
    });

    const savedSubscription = await newSubscription.save();

    res.status(201).json({
      success: true,
      subscription: savedSubscription,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

exports.getAllSubscriptions = async (req, res) => {
    try {
      const subscriptions = await Subscription.find().populate('productId').populate('deliveryBoyId').sort({ createdAt: -1 });
      res.status(200).json({ success: subscriptions });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  
  exports.getAllSubscriptionsdelieryboy = async (req, res) => {
    try {
        let id=req.params.id;
      const subscriptions = await Subscription.find({deliveryBoyId:id}).populate('productId').populate('deliveryBoyId').populate("walletId").sort({ createdAt: -1 });
      res.status(200).json({ success: subscriptions });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  
  exports.getAllSubscriptionsbyuserid = async (req, res) => {
    try {
        let id=req.params.id;
      const subscriptions = await Subscription.find({userId:id}).populate('productId').populate('deliveryBoyId').sort({ createdAt: -1 });
      res.status(200).json({ success: subscriptions });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  
  exports.getOrderByclubUser = async (req, res) => {
    try {
        let userId = req.params.userId
        let finddata = await Subscription.find({ userId: userId }).populate("cartId")
        if (finddata.length <= 0) return res.status(200).json({ success: "Data not found" });
        return res.status(200).json({ success: finddata })
    } catch (err) {
        console.log(err);
    }
}

exports.verifyDeliveryOTPsub = async (req, res) => {
  try {
    const { orderId,deliveryId, otp, remarks, status,deliveryDate,mobile } = req.body;

    // Validate required fields
    if (!orderId || !otp||!deliveryId) {
      return res.status(400).json({ error: "Order ID and OTP are required" });
    }
    
    let verify = await otpModel.findOne({
          otp: otp,
          mobile: mobile,
        });
        
    if (!verify) {
      return res.status(400).json({ error: "Invalid OTP" });
    }
    
 // Find the subscription
    let subscription = await Subscription.findById(orderId);

    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    // Find the delivery object in the deliveryData array
    const delivery = subscription.deliveryData.id(deliveryId);

    if (!delivery) {
      return res.status(404).json({ message: "Delivery not found" });
    }

    // Update the fields if provided in the request
    if (status) delivery.status = status;
    
   delivery.deliveryType = "Otp Verification";
   
    if(remarks) delivery.remarks = remarks;

    // Save the updated subscription
  subscription=  await subscription.save();



    // Respond with success and the updated data
    return res.status(200).json({ 
      success: true, 
      message: "OTP verified successfully", 
      remarks: subscription.remarks || null, 
      status: subscription.status || null ,
      data:subscription,
      deliveryDate : subscription.deliveryDate
    });

  } catch (error) {
    console.error('OTP verification error:', error);
    return res.status(500).json({ error: "Internal server error" });
  }
}


exports.uploadDeliveryProofsub = async (req, res) => {
    try {
console.log("calling")
      deliveryUpload(req, res, async function(err) {
        if (err instanceof multer.MulterError) {
          return res.status(400).json({ error: "File upload error" });
        } else if (err) {
          return res.status(400).json({ error: err.message });
        }

        const {deliveryId, orderId ,remarks,status,deliveryDate} = req.body;
        if (!orderId) {
          return res.status(400).json({ error: "Order ID is required" });
        }

        if (!req.file) {
          return res.status(400).json({ error: "No image file provided" });
        }
        
// const { deliveryId, status, deliveryType, proofImg,remarks } = req.body;

 
    // Find the subscription
    let subscription = await Subscription.findById(orderId);

    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    // Find the delivery object in the deliveryData array
    const delivery = subscription.deliveryData.id(deliveryId);

    if (!delivery) {
      return res.status(404).json({ message: "Delivery not found" });
    }

    // Update the fields if provided in the request
    if (status) delivery.status = status;
    
  delivery.deliveryType = "Photo Proof";
    if ( req.file.filename) delivery.proofImg = req.file.filename;
    if(remarks) delivery.remarks = remarks;

    // Save the updated subscription
 subscription= await subscription.save();

  return  res.status(200).json({ success: true, 
          message: "Delivery proof uploaded successfully",
          imagePath: req.file.filename,
          data:subscription,});
    //     let order = await Subscription.findById(orderId);
    //     if (!order) {
    //       return res.status(404).json({ error: "Order not found" });
    //     }

    //     // Update order with delivery proof image path
    //     order.deliveryProof = req.file.filename;
    //     order.remarks = remarks;
    //     order.status = status;
    //     order.deliveryDate = deliveryDate;
    //   order= await order.save();

    //     return res.status(200).json({ 
    //       success: true, 
    //       message: "Delivery proof uploaded successfully",
    //       imagePath: req.file.filename,
    //       data:order,
         
    //     });
      });
    } catch (error) {
      console.error('Delivery proof upload error:', error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
  
exports.updateSubscription = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      frequency,
      quantity,
      startDate,
      endDate,
      dayQuantities,
      nthInterval,
      status
    } = req.body;

    const updatedSubscription = await Subscription.findByIdAndUpdate(
      id,
      {
        frequency,
        quantity,
        startDate,
        endDate,
        dayQuantities,
        nthInterval,
        status
      },
      { new: true, runValidators: true }
    );

    if (!updatedSubscription) {
      return res.status(404).json({
        success: false,
        error: "Subscription not found"
      });
    }

    res.status(200).json({
      success: true,
      subscription: updatedSubscription
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};
exports.changeSubscriptionStatus= async (req, res) => {
  
  try {
      let user = req.params.userId;
    const data = await Subscription.findOneAndUpdate(
      { _id: user },
      { status: "Approved" }
    );
    if (!data) {
      return res.status(403).json({
        error: "Cannot able to find the user",
      });
    } else {
      return res.json({ success: "Blocked Successful" });
    }
  } catch (err) {
    console.log(err);
  }
}

exports.pauseSubscription = async (req, res) => {
  try {
    const { subscriptionId, pauseDate } = req.body;

    if (!pauseDate) {
      return res.status(400).json({ success: false, message: "Pause date is required" });
    }

    const subscription = await Subscription.findById(subscriptionId);

    if (!subscription) {
      return res.status(404).json({ success: false, message: "Subscription not found" });
    }

  
    if (subscription.pauseDates.includes(new Date(pauseDate))) {
      return res.status(400).json({ success: false, message: "This date is already paused" });
    }

   
    subscription.pauseDates.push(new Date(pauseDate));
    await subscription.save();

    res.status(200).json({ success: true, subscription });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.removePauseDate = async (req, res) => {
  try {
    const { subscriptionId, pauseDate } = req.body;

    if (!pauseDate) {
      return res.status(400).json({ success: false, message: "Pause date is required" });
    }

    const subscription = await Subscription.findById(subscriptionId);

    if (!subscription) {
      return res.status(404).json({ success: false, message: "Subscription not found" });
    }

    // Convert to Date object for accurate comparison
    const pauseDateObj = new Date(pauseDate);
    
    // Check if the date exists in the pauseDates array
    const index = subscription.pauseDates.findIndex(
      (date) => new Date(date).toISOString() === pauseDateObj.toISOString()
    );

    if (index === -1) {
      return res.status(400).json({ success: false, message: "Pause date not found" });
    }

    // Remove the date from the array
    subscription.pauseDates.splice(index, 1);
    await subscription.save();

    res.status(200).json({ success: true, message: "Pause date removed successfully", subscription });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.assignOrderToDeliveryBoy = async (req, res) => {
  const { orderId, deliveryBoyId } = req.body;

  try {
    const order = await Subscription.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const deliveryBoy = await driverModel.findById(deliveryBoyId);
    if (!deliveryBoy) {
      return res.status(404).json({ error: 'Delivery boy not found' });
    }

    // Assign delivery boy to the order
    order.deliveryBoyId = deliveryBoyId;
    await order.save();

    // Mark delivery boy as busy
    deliveryBoy.status = 'busy';
    await deliveryBoy.save();

    res.status(200).json({ success: true, message: 'Order assigned to delivery boy', order });
  } catch (error) {
    res.status(500).json({ error: 'Error assigning delivery boy' });
  }
};
exports.getOrdersByDeliveryBoy = async (req, res) => {
  const { deliveryBoyId } = req.params;
  try {
    const orders = await Subscription.find({ deliveryBoyId });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching orders for delivery boy' });
  }
};
exports.updateOrderStatus1 = async (req, res) => {
  try {
    const { orderId, status, remarks } = req.body;

    if (!orderId || !status) {
      return res.status(400).json({ error: "orderId and status are required" });
    }

    if (!['Delivered', 'Undelivered','Approved'].includes(status)) {
      return res.status(400).json({ error: "Invalid status. Must be 'Delivered' or 'Undelivered'" });
    }

    let updatedOrder = await Subscription.findOneAndUpdate(
      { _id: orderId },
      { $set: { status: status, remarks: remarks } },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }
    if (status === 'Delivered' && updatedOrder.deliveryBoyId) {
      await driverModel.findByIdAndUpdate(updatedOrder.deliveryBoyId, { status: 'available' });
    }
  
    return res.status(200).json({ 
      success: `Order successfully marked as ${status}`, 
      order: updatedOrder 
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

exports.makeDeliveryProduct=async(req,res)=>{
    try{
         const { subscriptionId } = req.params;
  const { deliveryId, status, deliveryType, proofImg,remarks } = req.body;

 
    // Find the subscription
    const subscription = await Subscription.findById(subscriptionId);

    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    // Find the delivery object in the deliveryData array
    const delivery = subscription.deliveryData.id(deliveryId);

    if (!delivery) {
      return res.status(404).json({ message: "Delivery not found" });
    }

    // Update the fields if provided in the request
    if (status) delivery.status = status;
    
    if (deliveryType) delivery.deliveryType = deliveryType;
    if (proofImg) delivery.proofImg = proofImg;
    if(remarks) delivery.remarks = remarks;

    // Save the updated subscription
    await subscription.save();

    res.status(200).json({ message: "Delivery updated successfully", delivery });
    }catch(error){
        console.log(error)
    }
}

