const loanModel = require("../../Model/User/loans");
const { phonenumber, isValidString, isValidEmail, isValid, isValidPassword, isValidObjectId } = require('../../Config/function')

class Loan {
    async addLoan(req, res) {
        try {
            const { mobile, userProfile, userName, email, desireAmount, rate, year, totalAmount, userId, productId } = req.body;
            let obj = { mobile, userProfile, userName, email, desireAmount, rate, year, totalAmount, userId, productId }

            if (!isValid(userName)) return res.status(400).json({ error: "Name is required!" });
            if (!isValidString(userName)) return res.status(400).json({ error: "Name should be alphabets minmum size 3-25!" });


            if (!isValid(mobile)) return res.status(400).json({ error: "Mobile number is required!" });
            if (!phonenumber(mobile)) return res.status(400).json({ error: "Invalid mobile number!" });

            if (!isValid(email)) return res.status(400).json({ error: "Email id is required!" });
            if (!isValidEmail(email)) return res.status(400).json({ error: "Invalid email id!" });

            if (!isValid(userProfile)) return res.status(400).json({ error: "User profile is required!" });

            if (!isValid(desireAmount)) return res.status(400).json({ error: "Desire amount is required!" });
            if (!isValid(userId)) return res.status(400).json({ error: "User Id is required!" });

            if (req.files.length != 0) {
                let arr = req.files
                let i
                for (i = 0; i < arr.length; i++) {
                    if (arr[i].fieldname == "panCard") {
                        obj["userDoc.panCard"] = arr[i].filename
                    }
                    if (arr[i].fieldname == "adharCard") {
                        obj["userDoc.adharCard"] = arr[i].filename
                    }
                    if (arr[i].fieldname == "incomeCerticate") {
                        obj["userDoc.incomeCerticate"] = arr[i].filename
                    }
                    if (arr[i].fieldname == "residance") {
                        obj["userDoc.residance"] = arr[i].filename
                    } if (arr[i].fieldname == "bankStatement") {
                        obj["userDoc.bankStatement"] = arr[i].filename
                    }
                }
            }else{ return res.status(400).json({ error: "Documents is required!" }) }


            let data = await loanModel.create(obj)
            if (!data) return res.status(400).json({ error: "Something went worng!" })
            return res.status(200).json({ success: "Successfully Applyed" })
        } catch (error) {
            console.log(error);
        }
    }
    async updateLoan(req, res) {
        try {
            const { loanId, mobile, userProfile, userName, email, desireAmount, rate, year, totalAmount, productId } = req.body;
            let obj = {}
            if (!isValid(loanId)) return res.status(400).json({ error: "Loan Id is required!" });
            if (mobile) {
                obj["mobile"] = mobile;
            }
            if (userName) {
                obj["user"]
            }
            if (userProfile) {
                obj["userProfile"] = userProfile;
            }
            if (email) {
                if (!isValidEmail(email)) return res.status(400).json({ error: "Invalid email id!" });
                obj["email"] = email;
            }
            if (mobile) {
                if (!phonenumber(mobile)) return res.status(400).json({ error: "Invalid mobile number!" });
                obj["mobile"] = mobile;
            }
            if (desireAmount) {
                obj["desireAmount"] = desireAmount;
            }
            if (rate) {
                obj["rate"] = rate;
            }
            if (year) {
                obj["year"] = year;
            }
            if (totalAmount) {
                obj["totalAmount"] = totalAmount;
            }
            if (productId) {
                obj["productId"] = productId;
            }
            if (req.files.length != 0) {
                let arr = req.files
                let i
                for (i = 0; i < arr.length; i++) {
                    if (arr[i].fieldname == "panCard") {
                        obj["userDoc.panCard"] = arr[i].filename
                    }
                    if (arr[i].fieldname == "adharCard") {
                        obj["userDoc.adharCard"] = arr[i].filename
                    }
                    if (arr[i].fieldname == "incomeCerticate") {
                        obj["userDoc.incomeCerticate"] = arr[i].filename
                    }
                    if (arr[i].fieldname == "residance") {
                        obj["userDoc.residance"] = arr[i].filename
                    } if (arr[i].fieldname == "bankStatement") {
                        obj["userDoc.bankStatement"] = arr[i].filename
                    }
                }
            }
            let data = await loanModel.findOneAndUpdate({ _id: loanId }, { $set: obj }, { new: true });
            if (!data) return res.status(400).json({ error: "Something went worng!" });
            return res.status(200).json({ success: "Successfully updated" })
        } catch (error) {
            console.log(error);
        }
    }

    async getAllLoan(req, res) {
        try {
            let data = await loanModel.find()
            if (data.length <= 0) return res.status(400).json({ error: "Data not found!" });
            return res.status(200).json({ success: data });
        } catch (error) {
            console.log(error);
        }
    }
    async getByLoanId(req, res) {
        try {
            let loanId = req.params.loanId;
            let data = await loanModel.findById(loanId);
            if (!data) return res.status(400).json({ error: "Something went worng!" });
            return res.status(200).json({ success: data })
        } catch (error) {
            console.log(error);
        }
    }
    async getLoanByUserId(req, res) {
        try {
            let userId = req.params.userId;
            let data = await loanModel.find({ userId: userId });
            if (data.length <= 0) return res.status(400).json({ error: "Something went worng!" });
            return res.status(200).json({ success: data })
        } catch (error) {
            console.log(error);
        }
    }
    async getLoanByProductId(req, res) {
        try {
            let productId = req.params.productId;
            let data = await loanModel.find({ productId: productId })
            if (data.length <= 0) return res.status(400).json({ error: "Something went worng!" });
            return res.status(200).json({ success: data })
        } catch (error) {
            console.log(error);
        }
    }

    async changeLoanStatus(req, res) {
        try {
            const { status, loanId } = req.body;
            let changeStatus = await loanModel.findOneAndUpdate({ _id: loanId }, { $set: { status: status } }, { new: true });
            if (!changeStatus) return res.status(400).json({ error: "Something went worng!" });
            return res.status(200).json({ success: "Success" })
        } catch (error) {
            console.log(error);
        }
    }
    async deleteLoan(req,res){
        try {
            let loanId=req.params.loanId;
            let data=await loanModel.deleteOne({_id:loanId});
            if(data.deletedCount<=0) return res.status(400).json({error:"Data not found"});
            return res.status(200).json({success:"Successfully deleted!"});
        } catch (error) {
            console.log(error);
        }
    }
}
module.exports = new Loan()