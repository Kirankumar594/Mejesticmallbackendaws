const otpModel = require("../../Model/User/otp");
const {isValid, isValidEmail,phonenumber}=require('../../Config/function')
const {sendMail,sendSMS}=require("../../EmailSender/send");
const userModel = require("../../Model/User/user");
const drierModel=require("../../Model/User/driver");
const transportsModel=require("../../Model/User/transporter");
const adminModel=require('../../Model/Admin/admin');

const bcrypt = require("bcryptjs");
const saltRounds = 10;

class Otp {
  async sendOtp(req, res) {
    try {
    let { email } = req.body;
    if (!isValid(email))return res.status(400).json({ error: "Email Id is required!"})
    if(!isValidEmail(email)) return res.status(400).json({error:"Please enter valid email id!"});

      let check1=await userModel.findOne({email:email});
      if(!check1){
        check1=await drierModel.findOne({email:email})
      }
      if(!check1){
        check1=await transportsModel.findOne({email:email})
      }
      if(!check1){
        check1=await adminModel.findOne({email:email})
      }
      if(!check1){
        return res.status(400).json({error:"Please enter register email id!"})
      }
        let check = await otpModel.findOne({ email: email });
        if (check) {
          var otp = (Math.floor(Math.random() * 1000000) + 1000000)
          .toString()
          .substring(1);

          await otpModel.findOneAndUpdate({email:email},{$set:{otp:otp}},{new:true});
          sendMail(''+check1.name+' your resend otp is '+otp+'.',email,"Please do not share your otp.")
          return res.status(200).json({ success: "otp sent successfully", otp });

        } else {
          var otp = (Math.floor(Math.random() * 1000000) + 1000000)
            .toString()
            .substring(1);
              let send=await otpModel.create({email:email,otp:otp});
            if(send){
              sendMail(''+check1.name+' your  otp is '+otp+'.',email,"Please do not share your otp.")
                return res.status(200).json({ success: "otp sent successfully", otp });
            }else{
              return res.status(400).json({ error: "Something went worng!" });
            }
        }
      } catch (err) {
        console.log(err);
      }
    }
  

  async verifyotp(req, res,next) {
    const { otp,  mobile,
        Amobile,
        name,
        email,
        Houseno,
        address1,
        address2,
        landmark,
        pincode,
        deliveryzone,
        password,
        cpassword,
        clubRegisteredDate,
        status,lat,lng } = req.body;

    if (!isValid(otp)) {
      return res.json({ error: "enter otp" });
    } else {
      try {
        let verify = await otpModel.findOne({
          otp: otp,
          mobile: mobile,
        });
        if (verify) {
            if(name&&email&&password){
                  let encryptedPassword = bcrypt.hash(password, saltRounds).then((hash) => {
                 return hash;
             });
              let pwd = await encryptedPassword;
      
                 await userModel.create({mobile,
                      Amobile,
                 name,
                 email,
                     Houseno,
                address1,
                  address2,
                 landmark,
                 pincode,
              deliveryzone,
                 password:pwd,
                 cpassword:pwd,
              clubRegisteredDate,
                 status,lat,lng})
            }
           
            return res.status(200).json({ success: "Successfully verified OTP"});
        } else {
          return res.status(400).json({ error: "Incurrect OTP" });
        }
  
      } catch (err) {
        console.log(err);
      }
    }
  }
  
  async sendSMSOtp(req, res) {
    try {
    let { mobile,email } = req.body;
    if (!isValid(mobile))return res.status(400).json({ error: "Mobile Id is required!"})
    // if(!isValidEmail(email)) return res.status(400).json({error:"Please enter valid email id!"});
 if (!isValid(mobile))
        return res.status(400).json({ error: "Mobile number is required!" });
      if (!phonenumber(mobile))
        return res.status(400).json({ error: "Invalid mobile number!" });
      let check1 = await userModel.findOne({ mobile: mobile });
      if (check1)
        return res.status(400).json({ error: "Mobile number already exist!" });
    //   if (!isValid(email))
    //     return res.status(400).json({ error: "Email id is required!" });
    //   if (!isValidEmail(email))
    //     return res.status(400).json({ error: "Invalid email id!" });
      let check2 = await userModel.findOne({ email: email });
      if (check2)
        return res.status(400).json({ error: "Email id already exist!" });
   
 
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
      } catch (err) {
        console.log(err);
      }
    }
  
}
module.exports = new Otp();
