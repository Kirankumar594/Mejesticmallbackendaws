
const express = require('express');
const router = express.Router();
const walletcontroller = require("../../Controller/User/wallet")
const {Authentication,Authorization}=require("../../Authentication/auth")



router.post('/topup',Authentication, walletcontroller.topUpWallet);
router.put('/edit-transaction',Authentication, walletcontroller.editTransaction);
router.post('/debit',Authentication, walletcontroller.debitWallet);
router.get('/getwallet/:userId',Authentication, walletcontroller.getWalletByUser);
router.delete('/delete-transaction',Authentication, walletcontroller.deleteTransaction);
router.get('/all-wallets',Authentication, walletcontroller.getAllWallets);
router.put('/change-balance',Authentication, walletcontroller.changeWalletBalance);
router.post('/credit',Authentication, walletcontroller.creditWallet);

module.exports = router;
