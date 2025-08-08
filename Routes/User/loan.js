const express = require("express");
const router = express.Router();
const loanController=require("../../Controller/User/loan")
const multer = require("multer");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "/home/parnetsl1b/public_html/Public/loan");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post("/addLoan",upload.any(), loanController.addLoan);
router.put("/updateLoan",upload.any(),loanController.updateLoan);
router.post("/changeLoanStatus",loanController.changeLoanStatus);
router.get("/getByLoanId/:loanId",loanController.getByLoanId)
router.get("/getAllLoan",loanController.getAllLoan);
router.get("/getLoanByUserId/:userId",loanController.getLoanByUserId);
router.get("/getLoanByProductId/:productId",loanController.getLoanByProductId);
router.delete("/deleteLoan/:loanId",loanController.deleteLoan);
module.exports = router;