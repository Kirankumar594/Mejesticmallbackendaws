const transportModel=require('../../Model/User/transporter');
const bcrypt = require('bcryptjs');
const {phonenumber,isValidString,isValidEmail,isValid,isValidPassword, isValidObjectId}=require('../../Config/function')
const saltRounds = 10;
const otpModel=require("../../Model/User/otp")

class transport{
    async register(req,res){
        try{
            const {mobile,name,email,gender,password,cpassword}=req.body;
            if (!isValid(name)) return res.status(400).json({ error: "Name is required!" });
            if (!isValidString(name)) return res.status(400).json({ error: "Name should be alphabets minmum size 3-25!" });
            

            if (!isValid(mobile)) return res.status(400).json({ error: "Mobile number is required!" });
            if (!phonenumber(mobile)) return res.status(400).json({ error: "Invalid mobile number!" });
            let check1 =await transportModel.findOne({mobile:mobile});
            if(check1) return res.status(400).json({error:"Mobile number already exist!"});
            if (!isValid(email)) return res.status(400).json({ error: "Email id is required!" });
            if (!isValidEmail(email)) return res.status(400).json({ error: "Invalid email id!" });
            let check =await transportModel.findOne({email:email});
            if(check) return res.status(400).json({error:"Email id already exist!"});
            if (!isValid(gender)) return res.status(400).json({ error: "Gender is required!" });

            if (!isValid(password)) return res.status(400).json({ error: "Password is required!" });
            if (!isValid(cpassword)) return res.status(400).json({ error: "Confirm password is required!" });
            if (password != cpassword) return res.status(400).json({ error: "Password does not match!" });
        
            let encryptedPassword = bcrypt.hash(password, saltRounds)
            .then((hash) => {
              return hash;
            });
            let pwd = await encryptedPassword;

            let obj={mobile,name,gender,email,password:pwd};

            if (req.files.length != 0) {
                let arr = req.files
                let i
                for (i = 0; i < arr.length; i++) {
                    if (arr[i].fieldname == "profile") {
                        obj["profile"] = arr[i].filename
                    }
                }}else {return res.status(400).json({error:"Profile image required"})}

           let data= await transportModel.create(obj)
           if(!data) return res.status(400).json({error:"Profile image required"})
            return res.status(200).json({success:"Successfully register"})
        }catch(err){
            console.log(err);
        }
    }
    async login(req,res){
        try{
            const {email,password}=req.body;
            if (!isValid(email)) return res.status(400).json({ error: "Email id is required!" });
            if (!isValidEmail(email)) return res.status(400).json({ error: "Invalid email id!" });
            if (!isValid(password)) return res.status(400).json({ error: "Password is required!" });
            let check =await transportModel.findOne({email:email});

            if(!check) return res.status(400).json({error:"Please enter valid email Id"});

             let compare = await bcrypt.compare(password, check.password).then((res) => {
                return res
              });
          
              if (!compare) {return res.status(400).send({error: "password is not valid" });}

            return res.status(200).json({msg:"Successfully login",success:check});
        }catch(err){
            console.log(err);
        }
    }
    async editUser(req,res){
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

        let update =await transportModel.findOneAndUpdate({_id:adminId},{$set:obj},{new:true});
            if(!update) return res.status(400).json({error:"Something went worng"});
            return res.status(200).json({success:"Successfully updated"})
        }catch(err){
            console.log(err);
        }
    }
    async getAllUser(req,res){
        try {
            let allData=await transportModel.find()
            if(allData.length<=0) return res.status(404).json({error:"Data not found"});
            return res.status(200).json({success:allData})
        } catch (error) {
            console.log(error);
        }
    }
    async getUserById(req,res){
        try {
            let userId=req.params.userId;
            if(!isValidObjectId(userId)) return res.status(400).json({error:"User id is not valid!"});
            let user=await transportModel.findById(userId);
            if(!user) return res.status(404).json({error:"Data not found!"});
            return res.status(200).json({success:user})
        } catch (error) {
            console.log(error);
        }
    }
    async deleteUser(req,res){
        try {
            let userId=req.params.userId;
            if(!isValidObjectId(userId)) return res.status(400).json({error:"User id is not valid!"});
            let user=await transportModel.deleteOne({_id:userId});
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
            let update = await transportModel.findOneAndUpdate({ email: email }, { $set: { password: pwd } }, { new: true })
            if (!update) return res.status(400).json({ error: "Something went worng!" });
            return res.status(200).json({ success: "Successfully changed password" })
        } catch (error) {
            console.log(error);
        }
    }
}
module.exports=new transport();