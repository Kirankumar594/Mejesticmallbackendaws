const orderModel = require('../../Model/User/order');
const driverModel = require('../../Model/User/driver');
const bcrypt = require('bcryptjs');
const {sendMail,sendSMS}=require("../../EmailSender/send");
const {phonenumber,isValidString,isValidEmail,isValid,isValidPassword, isValidObjectId}=require('../../Config/function')
const saltRounds = 10;
const otpModel=require('../../Model/User/otp')
const jwt = require('jsonwebtoken');
// Constants
const DUMMY_OTP = "123456";

// Utility function to validate phone number
const isValidPhone = (phone) => {
  return /^\d{10}$/.test(phone);
};
class driver{
      async registerdriver(req, res) {
  try {
    const { name, mobile, email } = req.body;
    console.log(name, mobile, email);
    if (!name || !mobile || !email) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
    if (!phonenumber(mobile)) {
      return res.status(400).json({ error: 'Invalid mobile number' });
    }
    const generateUniqueCode = async () => {
      let code;
      let exists = true;
      while (exists) {
        code = Math.floor(10000 + Math.random() * 90000).toString();
       
        const existingDriver = await driverModel.findOne({ driverId: code });
        exists = existingDriver !== null;
      }
      return code;
    };

    // Create new driver instance
    const driver = new driverModel({
      name,
      mobile,
      email,
    });


    driver.driverId = await generateUniqueCode();

    await driver.save();

    res.status(200).json({
      success: true,
      data: driver,
      message: 'Driver registered successfully',
      driverId: driver.driverId, // Return the generated Driver ID
    });

  } catch (error) {
    console.error('Driver registration error:', error);
    res.status(500).json({
      error: 'Registration failed',
      details: error.message,
    });
  }
}

async addDoc(req, res) {
  try {
    const { id } = req.body;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Driver ID is required'
      });
    }

    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No files were uploaded'
      });
    }
    const updateFields = {};
    if (req.files.aadharFront) {
      updateFields.aadharFront = req.files.aadharFront[0].filename;
    }
    if (req.files.aadharBack) {
      updateFields.aadharBack = req.files.aadharBack[0].filename;
    }
    if (req.files.panImage) {
      updateFields.panImage = req.files.panImage[0].filename;
    }
    if (req.files.dlImage) {
      updateFields.dlImage = req.files.dlImage[0].filename;
    }
    const updatedDriver = await driverModel.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true }
    );
 console.log(updatedDriver,"updatedDriver>>>>>>>>>")
    if (!updatedDriver) {
      return res.status(404).json({
        success: false,
        error: 'Driver not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Documents uploaded successfully',
      data: updatedDriver
    });

  } catch (error) {
    console.error('Document upload error:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

     async sendOTP(req, res) {
    try {
      const { mobile } = req.body;
      if (!isValid(mobile)) {
        return res.status(400).json({ error: "Phone number is required!" });
      }
      if (!isValidPhone(mobile)) {
        return res.status(400).json({ error: "Invalid phone number! Please enter 10 digits." });
      }

      const driver = await driverModel.findOne({ mobile });
      if (!driver) {
        return res.status(400).json({ error: "No driver found with this phone number" });
      }
      if (driver.blockstatus) {
        return res.status(403).json({ error: "Your account has been blocked or not approed" });
      }
        var otp = (Math.floor(Math.random() * 1000000) + 1000000)
          .toString()
          .substring(1);
          
//             const result =await sendSMS(
//             mobile,        
//            `Your OTP for mobile number verification at Abhinandan Organic is  ${otp}.

// Please use this OTP to complete your verification.`, // Your SMS message
//             'ABHIAN',      // Replace with approved SenderID
//             'TRANS',     // Replace with the route name
//             '1107173641973511689'    // Replace with the DLT Template ID
//         );
//         console.log('SMS sent successfully:', result);

   let check= await otpModel.findOneAndUpdate(
        { mobile },
       {$set: {
          otp: otp,
          createdAt: new Date()
        }},
        {  new: true }
      );
      if(!check){
          await otpModel.create({mobile,otp})
      }

      return res.status(200).json({
        message: "OTP sent successfully",
        dummy_otp: otp 
      });

    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: "Internal server error" });
    }
     }

  
  async logindriver(req, res) {
    try {
      const { mobile, otp } = req.body;

      // Validate inputs
      if (!isValid(mobile)) {
        return res.status(400).json({ error: "Phone number is required!" });
      }
      if (!isValid(otp)) {
        return res.status(400).json({ error: "OTP is required!" });
      }

      // Find driver
      const driver = await driverModel.findOne({ mobile });
      if (!driver) {
        return res.status(400).json({ error: "No driver found with this phone number" });
      }

      // Check if driver is blocked
      if (driver.blockstatus) {
        return res.status(403).json({ error: "Your account has been blocked" });
      }
 let check= await otpModel.findOne({mobile})
      // For testing, directly check if OTP matches dummy OTP
      console.log("otp==>",otp,check.otp)
      if (otp != check.otp) {
        return res.status(400).json({ error: "Invalid OTP" });
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: driver._id.toString() },
        "Abhinandhan"
      );

      // Set token in header
      res.header("Authorization", "Bearer : " + token);

      return res.status(200).json({
        msg: "Successfully logged in",
        success: driver,
        token: token
      });

    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
async changedriverBlockStatus(req, res) {
  
    try {
        let user = req.params.userId;
        console.log(user);
      const data = await driverModel.findOneAndUpdate(
        { _id: user },
        { blockstatus: true }
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
async changedriverunBlockStatus(req, res) {
  
  try {
      let user = req.params.userId;
      console.log(user);
    const data = await driverModel.findOneAndUpdate(
      { _id: user },
      { blockstatus: false }
    );
    if (!data) {
      return res.status(403).json({
        error: "Cannot able to find the user",
      });
    } else {
      return res.json({ success: "Approved Successful" });
    }
  } catch (err) {
    console.log(err);
  }
}
    async editdriver(req,res){
        try{
            const {mobile,name,gender,email,password,adminId}=req.body;
            let obj={}
            if(mobile){
                if (!phonenumber(mobile)) return res.status(400).json({ error: "Invalid mobile number!" });
                obj["mobile"]=mobile
            }
            if(name){
                if (!isValidString(name)) return res.status(400).json({ error: "Name should be alphabets minmum size 3-25!" });
                obj["name"]=name
            }
            if(email){
                if (!isValidEmail(email)) return res.status(400).json({ error: "Invalid email id!" });
                obj["email"]=email
            }
            if(gender){
                obj["gender"]=gender;
            }
            if(password){
                let encryptedPassword = bcrypt.hash(password, saltRounds)
                .then((hash) => {
                  return hash;
                });
                let pwd = await encryptedPassword;
                obj["password"]=pwd;
            }
            if (req.files.length != 0) {
                let arr = req.files
                let i
                for (i = 0; i < arr.length; i++) {
                    if (arr[i].fieldname == "profile") {
                        obj["profile"] = arr[i].filename
                    }
                }}

        let update =await driverModel.findOneAndUpdate({_id:adminId},{$set:obj},{new:true});
            if(!update) return res.status(400).json({error:"Something went worng"});
            return res.status(200).json({success:"Successfully updated"})
        }catch(err){
            console.log(err);
        }
    }
    async getAlldriver(req,res){
        try {
            let allData=await driverModel.find().sort({ createdAt: -1 });
            if(allData.length<=0) return res.status(404).json({error:"Data not found"});
            return res.status(200).json({success:allData})
        } catch (error) {
            console.log(error);
        }
    }
    async getMyOrders(req, res) {
        const { deliveryBoyId } = req.user; 
        try {
          const orders = await orderModel.find({ deliveryBoyId }).sort({ createdAt: -1 });
          res.status(200).json({ success: true, orders });
        } catch (error) {
          res.status(500).json({ error: 'Failed to get orders' });
        }
      };
    async getdriverById(req,res){
        try {
            let userId=req.params.userId;
            if(!isValidObjectId(userId)) return res.status(400).json({error:"User id is not valid!"});
            let user=await driverModel.findById(userId);
            if(!user) return res.status(404).json({error:"Data not found!"});
            return res.status(200).json({success:user})
        } catch (error) {
            console.log(error);
        }
    }
    async deletedriver(req,res){
        try {
            let userId=req.params.userId;
            if(!isValidObjectId(userId)) return res.status(400).json({error:"User id is not valid!"});
            let user=await driverModel.deleteOne({_id:userId});
            if(user.deletedCount<=0) return res.status(404).json({error:"Data not found!"});
            return res.status(200).json({success:"Successfully deleted"}) 
        } catch (error) {
            console.log(error);
        }
    }
    async forgetPwd(req, res) {
        try {
            const { otp, email, password, cpassword } = req.body;
            if (!isValid(otp)) return res.status(400).json({ error: "Otp is required!" });
            if (!isValid(email)) return res.status(400).json({ error: "Email id is required!" });
            let check = await otpModel.findOne({ email: email, otp: otp });
            if (!check) return res.status(400).json({ error: "Otp not verified!" })
            if (password != cpassword) return res.status(400).json({ error: "Password dose not match!" });
            let encryptedPassword = bcrypt.hash(password, saltRounds)
                .then((hash) => {
                    return hash;
                });
            let pwd = await encryptedPassword;
            let update = await driverModel.findOneAndUpdate({ email: email }, { $set: { password: pwd } }, { new: true })
            if (!update) return res.status(400).json({ error: "Something went worng!" });
            return res.status(200).json({ success: "Successfully changed password" })
        } catch (error) {
            console.log(error);
        }
    }
}
module.exports=new driver();