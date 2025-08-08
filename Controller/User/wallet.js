const walletModel = require('../../Model/User/wallet');
const mongoose = require("mongoose");

class wallet {


    async topUpWallet(req, res) {
        try {
            const { userId, amount, detail } = req.body;
            console.log(" userId, amount, detail", userId, amount, detail)
            if (!amount || amount <= 0) {
                return res.status(400).json({ error: "Invalid amount" });
            }
            if (amount < 300) {
                return res.status(400).json({ error: "Minimum top-up amount is 300" });
            }
            let wallet = await walletModel.findOne({ userId });
            if (!wallet) {
                wallet = new walletModel({ userId, balance: 0, transactions: [] });
            }

            wallet.balance += amount;



            const transaction = {
                transactionId: new mongoose.Types.ObjectId().toString(),
                detail: detail || "Top-up",
                credit: amount,
                debit: 0,

            };

            wallet.transactions.push(transaction);

            await wallet.save();

            return res.status(200).json({
                success: "Successfully topped up wallet", balance: wallet.balance
            });
        } catch (err) {
            console.log(err);
            res.status(500).json({ error: "Server error" });
        }
    }


    async editTransaction(req, res) {
        try {
            const { userId, transactionId, detail, credit, debit } = req.body;

            let wallet = await walletModel.findOne({ userId });
            if (!wallet) return res.status(404).json({ error: "Wallet not found" });

            let transaction = wallet.transactions.id(transactionId);
            if (!transaction) return res.status(404).json({ error: "Transaction not found" });

            if (detail) transaction.detail = detail;
            if (credit >= 0) transaction.credit = credit;
            if (debit >= 0) transaction.debit = debit;


            wallet.balance = wallet.transactions.reduce((acc, t) => acc + t.credit - t.debit, 0);

            await wallet.save();

            return res.status(200).json({ success: "Transaction updated", balance: wallet.balance });
        } catch (err) {
            console.log(err);
            res.status(500).json({ error: "Server error" });
        }
    }


    async getWalletByUser(req, res) {
        try {
            const userId = req.params.userId;


            if (!mongoose.Types.ObjectId.isValid(userId)) {
                return res.status(400).json({ error: "Invalid user ID format" });
            }


            const wallet = await walletModel.findOne({ userId }).populate("userId");

            if (!wallet) {
                return res.status(404).json({ error: "Wallet not found" });
            }

            return res.status(200).json({ success: wallet });
        } catch (err) {
            console.error('Error fetching wallet:', err);
            return res.status(500).json({ error: "Server error" });
        }
    }


    async deleteTransaction(req, res) {
        try {
            const { userId, transactionId } = req.body;

            let wallet = await walletModel.findOne({ userId });
            if (!wallet) return res.status(404).json({ error: "Wallet not found" });

            let transaction = wallet.transactions.id(transactionId);
            if (!transaction) return res.status(404).json({ error: "Transaction not found" });

            transaction.remove();


            wallet.balance = wallet.transactions.reduce((acc, t) => acc + t.credit - t.debit, 0);

            await wallet.save();

            return res.status(200).json({ success: "Transaction deleted", balance: wallet.balance });
        } catch (err) {
            console.log(err);
            res.status(500).json({ error: "Server error" });
        }
    }

    async getAllWallets(req, res) {
        try {
            let wallets = await walletModel.find({}).populate("userId").sort({ _id: -1 });
            if (wallets.length <= 0) return res.status(200).json({ success: "Data not found" });

            return res.status(200).json({ success: wallets });
        } catch (err) {
            console.log(err);
            res.status(500).json({ error: "Server error" });
        }
    }
    async debitWallet(req, res) {
        try {
            const { userId, amount, detail } = req.body;

            if (!amount || amount <= 0) {
                return res.status(400).json({ error: "Invalid amount" });
            }

            let wallet = await walletModel.findOne({ userId });
            if (!wallet) return res.status(404).json({ error: "Wallet not found" });


            if (wallet.balance < amount) {
                return res.status(400).json({ error: "Insufficient balance in wallet" });
            }




            wallet.balance -= amount;


            const transaction = {
                transactionId: new mongoose.Types.ObjectId().toString(),
                detail: detail || "Debit",
                credit: 0,
                debit: amount,

            };

            wallet.transactions.push(transaction);

            await wallet.save();

            return res.status(200).json({ success: "Wallet debited successfully", balance: wallet.balance });
        } catch (err) {
            console.log(err);
            res.status(500).json({ error: "Server error" });
        }
    }

    async changeWalletBalance(req, res) {
        try {
            const { userId, amount, detail } = req.body;


            let wallet = await walletModel.findOne({ userId });
            if (!wallet) return res.status(404).json({ error: "Wallet not found" });

            if (amount < 0) {
                if (wallet.balance + amount < 0) {
                    return res.status(400).json({ error: "Insufficient wallet balance" });
                }
            }
            wallet.balance += amount;
            const transaction = {
                transactionId: new mongoose.Types.ObjectId().toString(),
                detail: detail || (amount > 0 ? "Credit" : "Debit"),
                credit: amount > 0 ? amount : 0,
                debit: amount < 0 ? Math.abs(amount) : 0
            };
            wallet.transactions.push(transaction);
            await wallet.save();

            return res.status(200).json({ success: "Balance updated", balance: wallet.balance });
        } catch (err) {
            console.log(err);
            res.status(500).json({ error: "Server error" });
        }
    }
    async creditWallet(req, res) {
        try {
            const { userId, amount, detail } = req.body;

            if (!amount || amount <= 0) {
                return res.status(400).json({ error: "Invalid amount" });
            }

            let wallet = await walletModel.findOne({ userId });

            if (!wallet) {
                wallet = await walletModel.create({ userId });
            };

            wallet.balance += amount;

            const transaction = {
                transactionId: new mongoose.Types.ObjectId().toString(),
                detail: detail || "Credit",
                credit: amount,
                debit: 0,
            };

            wallet.transactions.push(transaction);

            await wallet.save();

            return res.status(200).json({ success: "Wallet credited successfully", balance: wallet.balance });
        } catch (err) {
            console.log(err);
            res.status(500).json({ error: "Server error" });
        }
    }

}

module.exports = new wallet();
