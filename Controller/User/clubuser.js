const clubuserModel = require("../../Model/User/clubuser");
const nodemailer = require('nodemailer');
const bcrypt = require("bcryptjs");
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

class clubuser {
  async clubregister(req, res) {
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
        status
      } = req.body;
      if (!isValid(name))
        return res.status(400).json({ error: "Name is required!" });
      if (!isValidString(name))
        return res
          .status(400)
          .json({ error: "Name should be alphabets minmum size 3-25!" });

      if (!isValid(mobile))
        return res.status(400).json({ error: "Mobile number is required!" });
      if (!phonenumber(mobile))
        return res.status(400).json({ error: "Invalid mobile number!" });
      let check1 = await clubuserModel.findOne({ mobile: mobile });
      if (check1)
        return res.status(400).json({ error: "Mobile number already exist!" });
      if (!isValid(email))
        return res.status(400).json({ error: "Email id is required!" });
      if (!isValidEmail(email))
        return res.status(400).json({ error: "Invalid email id!" });
      let check = await clubuserModel.findOne({ email: email });
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
        deliveryzone,
        password: pwd,
        status
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

      let data = await clubuserModel.create(obj);
      if (!data)
        return res.status(400).json({ error: "Profile image required" });
      return res.status(200).json({ success: "Successfully register" });
    } catch (err) {
      console.log(err);
    }
  }
  async clublogin(req, res) {
    try {
        const { email, password } = req.body;
        console.log(email);
        let hash = await clubuserModel.findOne({ $or: [{ email: email }, { mobile: email }] });
        if (!hash) return res.status(400).json({ success: "Please enter valid id" });


        let compare = await bcrypt.compare(password, hash.password).then((res) => {
            return res
        });

        if (!compare) { return res.status(400).send({ success: "password is not valid" }); }

        return res.status(200).json({ msg: "Successfully login", success: hash })

    } catch (err) {
        console.log(err);
    }
}
  async editclubUser(req, res) {
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
        status,
        adminId
      } = req.body;
  
      let obj = {};
  
      if (mobile) {
        
        obj["mobile"] = mobile;
      }
  
      if (Amobile) {
        
        obj["amobile"] = Amobile;
      }
  
      if (name) {
        
        obj["name"] = name;
      }
  
      if (email) {
       
        obj["email"] = email;
      }
  
      if (Houseno) {
        
        obj["houseno"] = Houseno;
      }
  
      if (address1) {
       
        obj["address1"] = address1;
      }
  
      if (address2) {
        
        obj["address2"] = address2;
      }
  
      if (landmark) {
        
        obj["landmark"] = landmark;
      }
  
      if (pincode) {
       
        obj["pincode"] = pincode;
      }
  
      if (deliveryzone) {
        
        obj["deliveryzone"] = deliveryzone;
      }
  
      if (password) {
        
        const encryptedPassword = await bcrypt.hash(password, saltRounds);
        obj["password"] = encryptedPassword;
      }
  
      if (status) {
        obj["status"] = status;
      }
  
      const update = await clubuserModel.findOneAndUpdate(
        { _id: adminId },
        { $set: obj },
        { new: true }
      );
  
      if (!update) {
        return res.status(400).json({ error: "Something went wrong" });
      }
  
      return res.status(200).json({ success: "Successfully updated", data: update });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
  async getAllclubUser(req, res) {
    try {
      let allData = await clubuserModel.find();
      if (allData.length <= 0)
        return res.status(404).json({ error: "Data not found" });
      return res.status(200).json({ success: allData });
    } catch (error) {
      console.log(error);
    }
  }
  async getclubUserById(req, res) {
    try {
      let userId = req.params.userId;
      if (!isValidObjectId(userId))
        return res.status(400).json({ error: "User id is not valid!" });
      let user = await clubuserModel.findById(userId);
      if (!user) return res.status(404).json({ error: "Data not found!" });
      return res.status(200).json({ success: user });
    } catch (error) {
      console.log(error);
    }
  }
  async deleteclubUser(req, res) {
    try {
      let userId = req.params.userId;
      if (!isValidObjectId(userId))
        return res.status(400).json({ error: "User id is not valid!" });
      let user = await clubuserModel.deleteOne({ _id: userId });
      if (user.deletedCount <= 0)
        return res.status(404).json({ error: "Data not found!" });
      return res.status(200).json({ success: "Successfully deleted" });
    } catch (error) {
      console.log(error);
    }
  }
  async changeclubBlockStatus(req, res) {
  
    try {
        let user = req.params.userId;
        console.log(user);
      const data = await clubuserModel.findOneAndUpdate(
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
async changeclubUnBlockStatus(req, res) {
  
  try {
      let user = req.params.userId;
      console.log(user);
    const data = await clubuserModel.findOneAndUpdate(
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
async clubforgetPwd(req, res){

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
  let data = await clubuserModel.findOne({email: email});
  if (data) {
    newPassword = bcrypt.hashSync(newPassword, 10);
    let passChange = clubuserModel.findOneAndUpdate({email : email} , {
      password: newPassword,
    });
  passChange.exec((err, result) => {
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
      return res.json({success: "mail send"})
    }
  });
});   
}else{
  return res.status(403).json({error: "Email not Register"})
}

}
}
module.exports = new clubuser();
