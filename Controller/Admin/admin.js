const adminModel=require('../../Model/Admin/admin');
const bcrypt = require('bcryptjs');
const {phonenumber,isValidString,isValidEmail,isValid,isValidPassword}=require('../../Config/function')
const saltRounds = 10;
const otpModel=require("../../Model/User/otp")
const jwt = require('jsonwebtoken');
class admin{
    async register(req,res){
        try{
            const {name,email,password}=req.body;
            if (!isValid(name)) return res.status(400).json({ error: "Name is required!" });
            if (!isValidString(name)) return res.status(400).json({ error: "Name should be alphabets minmum size 3-25!" });
            

           
            if (!isValid(email)) return res.status(400).json({ error: "Email id is required!" });
            if (!isValidEmail(email)) return res.status(400).json({ error: "Invalid email id!" });


            if (!isValid(password)) return res.status(400).json({ error: "Password is required!" });
            // if (!isValid(cpassword)) return res.status(400).json({ error: "Confirm password is required!" });
            // if (password != cpassword) return res.status(400).json({ error: "Password does not match!" });
        
            let encryptedPassword = bcrypt.hash(password, saltRounds)
            .then((hash) => {
              return hash;
            });
            let pwd = await encryptedPassword;

            let obj={name,email,password:pwd};

            // if (req.files.length != 0) {
            //     let arr = req.files
            //     let i
            //     for (i = 0; i < arr.length; i++) {
            //         if (arr[i].fieldname == "profile") {
            //             obj["profile"] = arr[i].filename
            //         }
            //     }}else {return res.status(400).json({error:"Profile image required"})}

           let data= await adminModel.create(obj)
           if(!data) return res.status(400).json({error:"Profile image required"})
            return res.status(200).json({success:"Successfully register"})
        }catch(err){
            console.log(err);
        }
    }
    async login(req,res){
        try{
            const {email,password,deviceTokens}=req.body;
            if (!isValid(email)) return res.status(400).json({ error: "Email id is required!" });
            if (!isValidEmail(email)) return res.status(400).json({ error: "Invalid email id!" });
            if (!isValid(password)) return res.status(400).json({ error: "Password is required!" });
            let check =await adminModel.findOne({email:email});

            if(!check) return res.status(400).json({success:"Please enter valid Id"});

             let compare = await bcrypt.compare(password, check.password).then((res) => {
                return res
              });
          
              if (!compare) {return res.status(400).send({success: "password is not valid" });}
              if (deviceTokens) {
                await adminModel.findByIdAndUpdate(check._id, { $addToSet: { deviceTokens: deviceTokens } }, { new: true });
              }
               let token = jwt.sign(
            { userId: check._id.toString() },
            "Abhinandhan", 
            { expiresIn: "1d" }
        );

        // Set the Authorization header
        res.header("Authorization", "Bearer " + token);
              return res.status(200).json({msg:"Successfully login",success:check,token:token});
        }catch(err){
            console.log(err);
        }
    }
    async editAdmin(req,res){
        try{
            const {mobile,name,email,password,adminId}=req.body;
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

        let update =await adminModel.findOneAndUpdate({_id:adminId},{$set:obj},{new:true});
            if(!update) return res.status(400).json({success:"Something went worng"});
            return res.status(200).json({success:"Successfully updated"})
        }catch(err){
            console.log(err);
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
            let update = await adminModel.findOneAndUpdate({ email: email }, { $set: { password: pwd } }, { new: true })
            if (!update) return res.status(400).json({ error: "Something went worng!" });
            return res.status(200).json({ success: "Successfully changed password" })
        } catch (error) {
            console.log(error);
        }
    }
}
module.exports=new admin();