const userModel = require("../../Model/User/user");
const bcrypt = require("bcryptjs");
const nodemailer = require('nodemailer');
const {
  phonenumber,
  isValidString,
  isValidEmail,
  isValid,
  isValidPassword,
  isValidObjectId,
} = require("../../Config/function");
const saltRounds = 10;
const otpModel = require("../../Model/User/otp");
const jwt = require('jsonwebtoken');
class user {
  async register(req, res) {
    try {
      const {
        mobile,
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
        status,
        lat,lng
      } = req.body;
      if (!isValid(name))
        return res.status(400).json({ error: "Name is required!" });
    //   if (!isValidString(name))
    //     return res
    //       .status(400)
    //       .json({ error: "Name should be alphabets minmum size 3-25!" });

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
      let check = await userModel.findOne({ email: email });
      if (check)
        return res.status(400).json({ error: "Email id already exist!" });
   

      if (!isValid(password))
        return res.status(400).json({ error: "Password is required!" });
      if (!isValid(cpassword))
        return res.status(400).json({ error: "Confirm password is required!" });
      if (password != cpassword)
        return res.status(400).json({ error: "Password does not match!" });

      let encryptedPassword = bcrypt.hash(password, saltRounds).then((hash) => {
        return hash;
      });
      let pwd = await encryptedPassword;

      let obj = {
        mobile,
        Amobile,
        name,
        email,
        address1,
        address2,
        Houseno,
        landmark,
        pincode,
        clubRegisteredDate,
        deliveryzone,
        password: pwd,
        status,lat,lng
      };

    //   if (req.files.length != 0) {
    //     let arr = req.files;
    //     let i;
    //     for (i = 0; i < arr.length; i++) {
    //       if (arr[i].fieldname == "profile") {
    //         obj["profile"] = arr[i].filename;
    //       }
    //     }
    //   } else {
    //     return res.status(400).json({ error: "Profile image required" });
    //   }

      let data = await userModel.create(obj);
      if (!data)
        return res.status(400).json({ error: "Profile image required" });
      return res.status(200).json({ success: "Successfully register" });
    } catch (err) {
      console.log(err);
    }
  }
  async login(req, res) {
    try {
        const { email, password } = req.body;
        console.log(email);
        let hash = await userModel.findOne({ $or: [{ email: email }, { mobile: email }] });
        if (!hash) return res.status(400).json({ success: "Please enter valid id" });


        let compare = await bcrypt.compare(password, hash.password).then((res) => {
            return res
        });

        if (!compare) { return res.status(400).send({ success: "password is not valid" }); }
 let token = jwt.sign({
        userId: hash._id.toString(),

    }, "Abhinandhan");

    res.header("Authorization", "Bearer : " + token);
        return res.status(200).json({ msg: "Successfully login", success: hash,token:token })

    } catch (err) {
        console.log(err);
    }
}

  async editUser(req, res) {
    try {
      const {
        mobile,
        Amobile,
        name,
        email,
        Houseno,
        address1,
        address2,
        landmark,
        pincode,
        deliveryzone,
        clubRegisteredDate,
        password,
        cpassword,
        status,
        adminId,
        lat,
        lng
      } = req.body;
       let update = await userModel.findById(adminId);
  
      if (!update) {
        return res.status(400).json({ error: "Data not found" });
      }
      let obj = {};
  
      if (mobile&&update.mobile!==mobile) {
           let check1 = await userModel.findOne({ mobile: mobile });
      if (check1)
        return res.status(400).json({ error: "Mobile number already exist!" });
        update["mobile"] = mobile;
      }
      
      if (email&&update.email!==email) {
    let check = await userModel.findOne({ email: email });
      if (check) return res.status(400).json({ error: "Email id already exist!" });
        update["email"] = email;
      }
        if (lat) {
        
        update["lat"] = lat;
      }
       if (lng) {
        
        update["lng"] = lng;
      }
  
      if (Amobile) {
        
        update["amobile"] = Amobile;
      }
  
      if (name) {
        
        update["name"] = name;
      }
  
      if (email) {
       
        update["email"] = email;
      }
  
      if (Houseno) {
        
        update["houseno"] = Houseno;
      }
  
      if (address1) {
       
        update["address1"] = address1;
      }
  
      if (address2) {
        
        update["address2"] = address2;
      }
  
      if (landmark) {
        
        update["landmark"] = landmark;
      }
  if (clubRegisteredDate) {
        
        update["clubRegisteredDate"] = clubRegisteredDate;
      }
      if (pincode) {
       
        update["pincode"] = pincode;
      }
  
      if (deliveryzone) {
        
        update["deliveryzone"] = deliveryzone;
      }
  
      if (password) {
        
        const encryptedPassword = await bcrypt.hash(password, saltRounds);
        update["password"] = encryptedPassword;
      }
  
      if (status) {
        update["status"] = status;
      }
  
 update=await update.save();
  
      return res.status(200).json({ success: "Successfully updated", data: update });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
  
  async getAllUser(req, res) {
    try {
      let allData = await userModel.find().sort({ createdAt: -1 });
      if (allData.length <= 0)
        return res.status(404).json({ error: "Data not found" });
      return res.status(200).json({ success: allData });
    } catch (error) {
      console.log(error);
    }
  }
  async getUserById(req, res) {
    try {
      let userId = req.params.userId;
      if (!isValidObjectId(userId))
        return res.status(400).json({ error: "User id is not valid!" });
      let user = await userModel.findById(userId);
      if (!user) return res.status(404).json({ error: "Data not found!" });
      return res.status(200).json({ success: user });
    } catch (error) {
      console.log(error);
    }
  }
  async deleteUser(req, res) {
    try {
      let userId = req.params.userId;
      if (!isValidObjectId(userId))
        return res.status(400).json({ error: "User id is not valid!" });
      let user = await userModel.deleteOne({ _id: userId });
      if (user.deletedCount <= 0)
        return res.status(404).json({ error: "Data not found!" });
      return res.status(200).json({ success: "Successfully deleted" });
    } catch (error) {
      console.log(error);
    }
  }
  async changeBlockStatus(req, res) {
  
    try {
        let user = req.params.userId;
        console.log(user);
      const data = await userModel.findOneAndUpdate(
        { _id: user },
        { status: "pending" }
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
async changeClubStatus(req, res) { 
  try {
      let user = req.params.userId;
        const { clubRegisteredDate } = req.body; 
    const data = await userModel.findOneAndUpdate(
      { _id: user },
      { club: true,clubRegisteredDate: clubRegisteredDate  }
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
async changeUnBlockStatus(req, res) {
  
  try {
      let user = req.params.userId;
      console.log(user);
    const data = await userModel.findOneAndUpdate(
      { _id: user },
      { status: "Approved" }
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
async forgetPwd(req, res){

  let { email } = req.body;

  function randomString(length, chars) {
    var mask = '';
    if (chars.indexOf('a') > -1) mask += 'abcdefghijklmnopqrstuvwxyz';
    if (chars.indexOf('A') > -1) mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (chars.indexOf('#') > -1) mask += '0123456789';
    if (chars.indexOf('!') > -1) mask += '~`!@#$%^&*()_+-={}[]:";\'<>?,./|\\';
    var result = '';
    for (var i = length; i > 0; --i) result += mask[Math.floor(Math.random() * mask.length)];
    return result;
}

  let newPassword = randomString(10, 'aA#');
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {        
      user: 'noreplyAbhinandhan@gmail.com',
      pass: 'wicp adrv cphv docp',
      
    }
  });
  
  const mailOptions = {
    from: 'noreplyAbhinandhan@gmail.com',
    to: email ,
    subject: 'Reset Password',
    text:`Password : ${newPassword}` 
  };
  let data = await userModel.findOne({email: email});
  if (data) {
      
    newPassword = bcrypt.hashSync(newPassword, 10);
    data.password=newPassword;
    data.cpassword=newPassword;
   await data.save();
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
      return res.json({success: "mail send"})
    }
  });
   
}else{
  return res.status(403).json({error: "Email not Register"})
}

}

  async verifyOtp(req, res) {
    try {
      const {  otp } = req.body;
console.log(otp)
    //   if (!email) {
    //     return res.status(400).json({ error: "Email id is required!" });
    //   }
      if (!otp) {
        return res.status(400).json({ error: "OTP is required!" });
      }

     
      const dummyOtp = "123456";
      if (otp !== dummyOtp) {
        return res.status(400).json({ error: "Invalid OTP!" });
      }


    //   let user = await userModel.findOne({ email });
    //   if (!user) {
    //     return res.status(404).json({ error: "User not found!" });
    //   }

    //   user.status = "Approved";
    //   await user.save();

      return res.status(200).json({ success: "OTP verified successfully!" });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: "Internal server error" });
    }
  }


}
module.exports = new user();
