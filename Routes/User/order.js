const express = require("express");
const router = express.Router();
const orderController=require('../../Controller/User/order')
const SalesOrder=require('../../Model/User/Salesorder')
const {Authentication,Authorization}=require("../../Authentication/auth")

router.post("/createOrder",Authentication, orderController.createOrder);
//getallOrderByUserId
router.get("/getallOrder",Authentication, orderController.getallOrder);
router.get("/getallOrderByUserId/:id",Authentication, orderController.getallOrderByUserId);
router.get("/getallOrderbydeleiryid/:id",Authentication, orderController.getallOrderbydeleiryid);
router.get("/getOrderByUser/:userId",Authentication,orderController.getOrderByUser);
router.post('/assignDeliveryBoy', orderController.assignOrderToDeliveryBoy);
router.post('/updateOrderStatus', orderController.updateOrderStatus);
router.post("/verifyDeliveryOTP",orderController.verifyDeliveryOTP);

router.post("/sendDeliverySendOtp",orderController.sendDeliverySendOtp);
router.post(
  "/uploadDeliveryProof",
  orderController.uploadDeliveryProof
);
router.get('/orders/:deliveryBoyId',Authentication, orderController.getOrdersByDeliveryBoy);

router.post("/saveSalesOrder", Authentication,async (req, res) => {
  try {
    const { orderId, items, discount, totalAmount } = req.body;

    const newSalesOrder = new SalesOrder({
      orderId,
      items,
      discount,
      totalAmount,
    });

    await newSalesOrder.save();
    res.status(200).json({ message: "Sales order saved successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to save sales order" });
  }
});
router.get("/getSalesOrder/:orderId", async (req, res) => {
  try {
    const salesOrder = await SalesOrder.findOne({ orderId: req.params.orderId });

    if (!salesOrder) {
      return res.status(404).json({ success: false, message: "Sales order not found" });
    }

    res.status(200).json({ success: true, data: salesOrder });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch sales order" });
  }
});
router.get('/getOriginalOrder/:orderId',Authentication, orderController.getOriginalOrder);
router.post("/editOrder",Authentication, orderController.editOrder);
router.delete("/deleteOrder/:orderId",Authentication,orderController.deleteOrder);
router.post("/makeOderStatusChange",Authentication,orderController.makeOderStatusChange);

module.exports = router;
