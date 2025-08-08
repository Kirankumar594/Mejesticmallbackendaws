const { isValid, phonenumber, isValidNum, isValidString, isValidObjectId, validUrl } = require('../../Config/function')
const orderModel = require('../../Model/User/order');
const driverModel = require('../../Model/User/driver');
const productModal = require("../../Model/Admin/product");
const otpModel = require("../../Model/User/otp");
const {sendMail,sendSMS}=require("../../EmailSender/send");

const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');
const Admin = require("../../Model/Admin/admin");
admin.initializeApp({
credential: admin.credential.cert(serviceAccount),
});
const messaging = admin.messaging();
const FCM = require("fcm-node");
const multer = require('multer');
const path = require('path');
const fs = require('fs');

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


async function SendNotificationToAdmin(shippingAddress,){
    try{
         const adminDeviceTokens = await Admin.findOne({ email: 'Abhinandhan@gmail.com' }, 'deviceTokens');
            const adminTokens = adminDeviceTokens.deviceTokens;
        
      
            const allDeviceTokens = [];
        
            if (adminTokens && adminTokens.length > 0) {
              allDeviceTokens.push(...adminTokens);
            }
        
          
        
            if (allDeviceTokens.length === 0) {
              return res.status(400).json({ error: "No device tokens found for admin or vendor. Booking completed without sending notifications." });
            }
            for (const token of allDeviceTokens) {
              const message = {
                token: token,
                notification: {
                  title: "New Order Placed",
                  body: `Order has been booked by ${shippingAddress?.fullName ? shippingAddress?.fullName : shippingAddress?.name}`,
                },
                android: {
                  notification: {
                    icon: "https://cdn.pixabay.com/photo/2014/12/21/23/28/package-575402_1280.png",
                  },
                },
                apns: {
                  payload: {
                    aps: {
                      icon: "https://cdn.pixabay.com/photo/2014/12/21/23/28/package-575402_1280.png",
                    },
                  },
                },
                webpush: {
                  headers: {
                    icon: "https://cdn.pixabay.com/photo/2014/12/21/23/28/package-575402_1280.png",
                  },
                },
              };
        
    
              await messaging.send(message)
                .then((response) => {
               
                  console.log("Successfully sent FCM message:", response);
                })
                .catch((error) => {
               
                  console.error("Error sending FCM message:", error);
                });
            }
           
    }catch(error){
        console.log(error)
    }
}

class order {
    async createOrder(req, res) {
        try {
            const { userId, items, totalAmount, discount, shippingAddress,deliveryCharge, paymentMethod,additionalInstructions,selecteddiscount,orderType} = req.body;
            if(!items?.length>0) return res.status(400).json({ error: "Plase add products in cart" });
            
            for(let i=0;i<items.length;i++){
                let check=await productModal.findById(items[i]?.productId);
                if(!check) return res.status(400).json({ error: `This product id ${items[i]?.productId} is not exits` });
                if((check.stock-check.sellproduct)<items[i]?.quantity) return res.status(400).json({ error: `This product id ${items[i]?.productId} is a out of stock` });
                check.sellproduct=check.sellproduct+Number(items[i]?.quantity);
               check= await check.save();
            }
            
            // SendNotificationToAdmin(shippingAddress)
            let data = await orderModel.create({userId, items,deliveryCharge, totalAmount, discount, shippingAddress, paymentMethod,additionalInstructions,selecteddiscount,orderType});
            if (!data) return res.status(400).json({ success: "Something went worng" });
           
            
            return res.status(200).json({ success: "Successfully added order" })
        } catch (err) {
            console.log(err);
            return({
                success: "Something went wrong",
                error: err.message
            })
        }
    }
    
    async editOrder(req, res) {
        try {
            const {
                orderId, deliveryCharge, fullName, number, email, pincode, state, city, address,
                paymentMethod, amount, discount, additionalInstructions, items,orderType
            } = req.body;
            let obj = {};
    
         
            let existingOrder = await orderModel.findById(orderId);
            if (!existingOrder) return res.status(400).json({ error: "Order not found" });
    
      
            if (fullName) {
                if (!isValidString(fullName)) return res.status(400).json({ error: "Name should be alphabets with size 3-25!" });
                obj["shippingAddress.fullName"] = fullName;
            }
            if (number) {
                if (!phonenumber(number)) return res.status(400).json({ error: "Invalid mobile number!" });
                obj["shippingAddress.number"] = number;
            }
            if (email) {
                if (!isValidEmail(email)) return res.status(400).json({ error: "Invalid email id!" });
                obj["shippingAddress.email"] = email;
            }
            if (state) obj["shippingAddress.state"] = state;
            if (city) obj["shippingAddress.city"] = city;
            if (address) obj["shippingAddress.street"] = address;
            if (pincode) {
                if (!/^[0-9]{6}$/.test(pincode)) return res.status(400).send({ error: "Invalid pin code" });
                obj["shippingAddress.pincode"] = pincode;
            }
            if (paymentMethod) obj["paymentMethod"] = paymentMethod;
            if (orderType) obj["orderType"] = orderType;
            if (deliveryCharge) obj["deliveryCharge"] = deliveryCharge;
            if (amount) obj["amount"] = amount;
            if (additionalInstructions) obj["additionalInstructions"] = additionalInstructions;
    
           
            let updatedOrder = await orderModel.findOneAndUpdate({ _id: orderId }, { $set: obj }, { new: true });
            if (!updatedOrder) return res.status(400).json({ error: "Something went wrong updating the order" });
    
            let totalAmount = 0; 
    
            if (items && items.length > 0) {
               
                for (let orderItem of existingOrder.items) {
                  
                    let updatedItem = items.find(item => item.itemId === orderItem._id.toString());
                    
                    if (updatedItem) {
                
                        const { quantity, weight, price } = updatedItem;
                        if (quantity) orderItem.quantity = parseFloat(quantity) || 0;
                        if (weight) orderItem.weight = parseFloat(weight) || 0;
                        if (price) orderItem.price = parseFloat(price) || orderItem.price;
                    }
    
                  
                    let finalPrice = orderItem.price * orderItem.quantity;
                    
                  
    
                 
                    totalAmount += finalPrice;
                }
    
               
                await existingOrder.save();
            }
           
            if (discount) {
                if (totalAmount < 1000) {
                    totalAmount += 40;
                }
                let discountAmount = totalAmount * (discount / 100);
                totalAmount -= discountAmount;
            }
    
        
            updatedOrder.totalAmount = totalAmount;
            await updatedOrder.save();
    
            return res.status(200).json({ success: "Successfully updated order", updatedOrder });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Internal server error" });
        }
    }
    async assignOrderToDeliveryBoy(req, res)  {
      const { orderId, deliveryBoyId } = req.body;
    
      try {
        const order = await orderModel.findById(orderId);
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
   async  getOrdersByDeliveryBoy(req, res) {
      const { deliveryBoyId } = req.params;
      try {
        const orders = await orderModel.find({ deliveryBoyId });
        res.status(200).json({ success: true, orders });
      } catch (error) {
        res.status(500).json({ error: 'Error fetching orders for delivery boy' });
      }
    };
    
    async getOrderByUser(req, res) {
        try {
            let userId = req.params.userId
            let finddata = await orderModel.find({ userId: userId }).populate("cartId").sort({ createdAt: -1 })
            if (finddata.length <= 0) return res.status(200).json({ success: "Data not found" });
            return res.status(200).json({ success: finddata })
        } catch (err) {
            console.log(err);
        }
    }


    async deleteOrder(req, res) {
        try {
            let orderId = req.params.orderId;
            let data = await orderModel.deleteOne({ _id: orderId });
            if (data.deletedCount <= 0) return res.status(200).json({ success: "Data not found" });
            return res.status(200).json({ success: "Successfully deleted" })
        } catch (err) {
            console.log(err);
        }
    }

    async getallOrder(req, res) {
        try {
            let allData = await orderModel.find({}).populate('items.productId').populate('deliveryBoyId').sort({ createdAt: -1 })
            if (allData.length <= 0) return res.status(200).json({ success: "Data not found" });
            return res.status(200).json({ success: allData })
        } catch (err) {
            console.log(err);
        }
    }
    
     async getallOrderbydeleiryid(req, res) {
        try {
            let id=req.params.id
            let allData = await orderModel.find({deliveryBoyId:id}).populate('items.productId').populate('deliveryBoyId').sort({ createdAt: -1 })
            if (allData.length <= 0) return res.status(200).json({ success: "Data not found" });
            return res.status(200).json({ success: allData })
        } catch (err) {
            console.log(err);
        }
    }
      async getallOrderByUserId(req, res) {
        try {
            let id=req.params.id;
            let allData = await orderModel.find({userId:id}).populate('items.productId').populate('deliveryBoyId').sort({ createdAt: -1 })
            if (allData.length <= 0) return res.status(200).json({ success: "Data not found" });
            return res.status(200).json({ success: allData })
        } catch (err) {
            console.log(err);
        }
    }
    
    
    
    async makeOderStatusChange(req, res) {
        try {
            let {orderId ,status}= req.body;

            let allData = await orderModel.findOneAndUpdate({ _id: orderId }, { $set: { status:status } }, { new: true });
            if (!allData) return res.status(200).json({ success: "Something went worng" });
            return res.status(200).json({ success: "Success" })
        } catch (err) {
            console.log(err);
        }
    }
    
    async updateOrderStatus(req, res) {
      try {
        const { orderId, status, remarks } = req.body;
  
        if (!orderId || !status) {
          return res.status(400).json({ error: "orderId and status are required" });
        }
  
        if (!['Delivered', 'Undelivered'].includes(status)) {
          return res.status(400).json({ error: "Invalid status. Must be 'Delivered' or 'Undelivered'" });
        }
  
        let updatedOrder = await orderModel.findOneAndUpdate(
          { _id: orderId },
          { $set: { status: status, remarks: remarks } },
          { new: true }
        );
  
        if (!updatedOrder) {
          return res.status(404).json({ error: "Order not found" });
        }
  
        // If the order is delivered, mark the delivery boy as available
        if (status === 'Delivered' && updatedOrder.deliveryBoyId) {
          await driverModel.findByIdAndUpdate(updatedOrder.deliveryBoyId, { status: 'available' });
        }
  
        // Send notification to admin
        const adminDeviceTokens = await Admin.findOne({ email: 'admin@gmail.com' }, 'deviceTokens');
        const adminTokens = adminDeviceTokens.deviceTokens;
  
        if (adminTokens && adminTokens.length > 0) {
          const message = {
            tokens: adminTokens,
            notification: {
              title: `Order ${status.charAt(0).toUpperCase() + status.slice(1)}`,
              body: `Order #${orderId.slice(-4)} has been marked as ${status}`,
            },
          };
  
          try {
            await messaging.sendMulticast(message);
            console.log('Successfully sent notifications to admin');
          } catch (error) {
            console.error('Error sending notifications:', error);
          }
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
    async getOriginalOrder(req, res)  {
  try {
    const { orderId } = req.params;
    const order = await orderModel.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Return the order data
    return res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error('Error fetching original order:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};
    
    async sendDeliverySendOtp(req,res){
        try{
            let {mobile}=req.body
             let check = await otpModel.findOne({ mobile: mobile });
        if (check) {
          var otp = (Math.floor(Math.random() * 1000000) + 1000000)
          .toString()
          .substring(1);

          await otpModel.findOneAndUpdate({mobile:mobile},{$set:{otp:otp}},{new:true});
                const result = await sendSMS(
            mobile,        
           `Your OTP for mobile number verification at Abhinandan Organic is  ${otp}.

Please use this OTP to complete your verification.`, // Your SMS message
            'ABHIAN',      // Replace with approved SenderID
            'TRANS',     // Replace with the route name
            '1107173641973511689'    // Replace with the DLT Template ID
        );
        console.log('SMS sent successfully:', result);
        //   sendMail(''+check1.name+' your resend otp is '+otp+'.',mobile,"Please do not share your otp.")
          return res.status(200).json({ success: "otp sent successfully"});

        } else {
          var otp = (Math.floor(Math.random() * 1000000) + 1000000)
            .toString()
            .substring(1);
              let send=await otpModel.create({mobile:mobile,otp:otp});
            if(send){
                const result = await sendSMS(
            mobile,        
           `Your OTP for mobile number verification at Abhinandan Organic is  ${otp}.

Please use this OTP to complete your verification.`, // Your SMS message
            'ABHIAN',      // Replace with approved SenderID
            'TRANS',     // Replace with the route name
            '1107173641973511689'    // Replace with the DLT Template ID
        );
        console.log('SMS sent successfully:', result);
                
            //   sendMail(''+check1.name+' your  otp is '+otp+'.',email,"Please do not share your otp.")
                return res.status(200).json({ success: "otp sent successfully" });
            }else{
              return res.status(400).json({ error: "Something went worng!" });
            }
        }
        }catch(error){
            console.log(error)
        }
    }
    
async verifyDeliveryOTP(req, res) {
  try {
    const { orderId, otp, remarks, status,deliveryDate,mobile } = req.body;
  console.log("otp1",mobile,otp)
    // Validate required fields
    if (!orderId || !otp) {
      return res.status(400).json({ error: "Order ID and OTP are required" });
    }
  console.log("otp2",mobile,otp)
    // Find the order by ID
    const order = await orderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    
    console.log("otp3",mobile,otp)
 let verify = await otpModel.findOne({
          otp: otp,
          mobile: mobile,
        });
        
    if (!verify) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    // Optionally update the remarks and status if provided
    if (remarks) {
      order.remarks = remarks;
    }
    
    if (status) {
      order.status = status;
    }

    // Save any changes to the order
    await order.save();

    // Respond with success and the updated data
    return res.status(200).json({ 
      success: true, 
      data:order,
      message: "OTP verified successfully", 
      remarks: order.remarks || null, 
      status: order.status || null, 
      deliveryDate:order.deliveryDate
    });

  } catch (error) {
    console.error('OTP verification error:', error);
    return res.status(500).json({ error: "Internal server error" });
  }
}


  async uploadDeliveryProof(req, res) {
    try {
      deliveryUpload(req, res, async function(err) {
        if (err instanceof multer.MulterError) {
          return res.status(400).json({ error: "File upload error" });
        } else if (err) {
          return res.status(400).json({ error: err.message });
        }

        const { orderId ,remarks,status,deliveryDate} = req.body;
        if (!orderId) {
          return res.status(400).json({ error: "Order ID is required" });
        }

        if (!req.file) {
          return res.status(400).json({ error: "No image file provided" });
        }

        const order = await orderModel.findById(orderId);
        if (!order) {
          return res.status(404).json({ error: "Order not found" });
        }

        // Update order with delivery proof image path
        order.deliveryProof = req.file.filename;
        order.remarks = remarks;
        order.deliveryDate = deliveryDate;
        order.status = status;
        await order.save();

        return res.status(200).json({ 
          success: true, 
          message: "Delivery proof uploaded successfully",
          imagePath: req.file.filename,
         data:order,
        });
      });
    } catch (error) {
      console.error('Delivery proof upload error:', error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

//   async updateOrderStatus(req, res) {
//     try {
//       const { orderId, status, remarks, deliveryProof, otp } = req.body;

//       if (!orderId || !status) {
//         return res.status(400).json({ error: "orderId and status are required" });
//       }

//       if (!['Delivered', 'Undelivered'].includes(status)) {
//         return res.status(400).json({ error: "Invalid status. Must be 'Delivered' or 'Undelivered'" });
//       }

//       // Additional validation for delivered status
//       if (status === 'Delivered' && (!deliveryProof && !otp)) {
//         return res.status(400).json({ error: "Delivery proof or OTP is required for delivered status" });
//       }

//       let updatedOrder = await orderModel.findOneAndUpdate(
//         { _id: orderId },
//         { 
//           $set: { 
//             status: status, 
//             remarks: remarks,
//             deliveryProof: deliveryProof,
//             deliveryOTP: otp,
//             deliveryDate: status === 'Delivered' ? new Date() : null
//           } 
//         },
//         { new: true }
//       );

//       if (!updatedOrder) {
//         return res.status(404).json({ error: "Order not found" });
//       }

//       // Update delivery boy status if order is completed
//       if (status === 'Delivered' && updatedOrder.deliveryBoyId) {
//         await driverModel.findByIdAndUpdate(
//           updatedOrder.deliveryBoyId, 
//           { status: 'available' }
//         );
//       }

//       // Send notification to admin
//       const adminDeviceTokens = await Admin.findOne(
//         { email: 'Abhinandhan@gmail.com' }, 
//         'deviceTokens'
//       );

//       if (adminDeviceTokens?.deviceTokens?.length > 0) {
//         const message = {
//           tokens: adminDeviceTokens.deviceTokens,
//           notification: {
//             title: `Order ${status}`,
//             body: `Order #${orderId.slice(-4)} has been marked as ${status}`,
//           },
//           data: {
//             orderId: orderId,
//             status: status,
//             type: 'ORDER_STATUS_UPDATE'
//           }
//         };

//         try {
//           await messaging.sendMulticast(message);
//           console.log('Successfully sent notifications to admin');
//         } catch (error) {
//           console.error('Error sending notifications:', error);
//         }
//       }

//       return res.status(200).json({ 
//         success: `Order successfully marked as ${status}`, 
//         order: updatedOrder 
//       });
//     } catch (error) {
//       console.error('Error updating order status:', error);
//       return res.status(500).json({ error: "Internal server error" });
//     }
//   }
}

module.exports = new order()