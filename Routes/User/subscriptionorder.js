
const express = require("express");
const router = express.Router();
const subscriptionController = require("../../Controller/User/subscriptionorder");
const {Authentication,Authorization}=require("../../Authentication/auth")

router.post("/create", Authentication, subscriptionController.createSubscription);
router.get('/getallSubscriptions',  subscriptionController.getAllSubscriptions);
router.post('/assignDeliveryBoy1', Authentication, subscriptionController.assignOrderToDeliveryBoy);
router.get('/orders1/:deliveryBoyId', Authentication, subscriptionController.getOrdersByDeliveryBoy);
router.get('/getAllSubscriptionsdelieryboy/:id', Authentication, subscriptionController.getAllSubscriptionsdelieryboy);
router.post("/verifyDeliveryOTPsub",subscriptionController.verifyDeliveryOTPsub);
router.get("/getAllSubscriptionsbyuserid/:id",subscriptionController.getAllSubscriptionsbyuserid);

router.post(
  "/makeDeliveryProduct/:subscriptionId",
  subscriptionController.makeDeliveryProduct
);

router.post(
  "/uploadDeliveryProofsub",
  subscriptionController.uploadDeliveryProofsub
);

router.post('/updateSubscription/:id',Authentication,  subscriptionController.updateSubscription);
router.post('/updateOrderStatus1',  subscriptionController.updateOrderStatus1);
router.post("/pauseSubscription", Authentication, subscriptionController.pauseSubscription);
router.post("/removePauseDate", Authentication, subscriptionController.removePauseDate);
router.get("/changeSubscriptionStatus/:userId",Authentication, subscriptionController.changeSubscriptionStatus);
router.get("/getOrderByclubUser/:userId",Authentication, subscriptionController.getOrderByclubUser);
module.exports = router;
