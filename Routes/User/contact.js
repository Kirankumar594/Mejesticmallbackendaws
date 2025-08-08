const express = require("express");
const router = express.Router();
const contactController=require('../../Controller/User/contact')


router.post("/createContact", contactController.createContact);

router.get("/getallContact", contactController.getallContact);
router.get("/getContactByUser/:userId",contactController.getContactByUser);
router.put("/editContact",contactController.editContact);
router.delete("/deleteContact/:contactId",contactController.deleteContact);
router.post("/makeStatusChangeContact",contactController.makeStatusChangeContact);
module.exports = router;
