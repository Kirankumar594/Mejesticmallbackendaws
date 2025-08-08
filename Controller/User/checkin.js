
const checkinModel=require("../../Model/User/checkin");
const {
  phonenumber,
  isValidString,
  isValidEmail,
  isValid,
  isValidPassword,
  isValidObjectId,
} = require("../../Config/function");
class checkIn{
    // async checkin(req,res){
    //     try {
    //         const {date,userId,status}=req.body;
    //         let obj={date,userId,status}
           

    //         // if (req.files.length != 0) {
    //         //     let arr = req.files
    //         //     let i
    //         //     for (i = 0; i < arr.length; i++) {
    //         //         if (arr[i].fieldname == "checkinImage") {
    //         //             obj["checkinImage"] = arr[i].filename
    //         //         }
    //         //     }}

              

          
    //       let checkIns=obj; 
    //       let data=await checkinModel.create(checkIns);
    //       if(!data) return res.status(400).json({error:"Something went worng"});
    //       return res.status(200).json({success:"Successfully Checked In"})



    //     } catch (error) {
    //         console.log(error);
    //     }
    // }
    async checkin(req, res) {
        try {
          const { date,userId,status, lat,
            long,
            address, } = req.body;
          let check = await checkinModel.findOne({
            userId: userId,
            date,
            status :"Check-In"
          });
          if (check) return res.status(400).json({ error: "You are already checked in!" });
          await checkinModel.create({ date,userId,status, lat,
            long,
            address,  });
    
          return res.status(200).json({ success: "Checked In" });
        } catch (err) {
          console.log(err);
        }
      }
    async checkout(req,res){
        try {
            const {date,userId,status,checkinId, lat,
              long,
              address,}=req.body;
            let obj={date,userId,checkinId, lat,
              long,
              address,}
            if (status) {
                obj["status"] = status;
              }
            // if (req.files.length != 0) {
            //     let arr = req.files
            //     let i
            //     for (i = 0; i < arr.length; i++) {
            //         if (arr[i].fieldname == "checkinImage") {
            //             obj["checkinImage"] = arr[i].filename
            //         }
            //     }}

              
           let checkOuts = obj; 
            let data = await checkinModel.findOneAndUpdate(
                { _id: checkinId },
               
                { $set: obj },
                { new: true }
              );  
        
          if(!data) return res.status(400).json({error:"Something went worng"});
          return res.status(200).json({success:"Successfully Checked Out"})



        } catch (error) {
            console.log(error);
        }
    }
      async getuserCheckin(req, res) {
    try {
      let userId = req.params.userId;
      if (!isValidObjectId(userId))
        return res.status(400).json({ error: "User id is not valid!" });
      let user = await checkinModel.find({ userId: userId }).sort({_id:-1});
      if (!user) return res.status(404).json({ error: "Data not found!" });
      return res.status(200).json({ success: user });
    } catch (error) {
      console.log(error);
    }
  }
    async getAllCheckin(req,res){
        try {
            let allData=await checkinModel.find().populate("userId").sort({_id:-1});
            if(allData.length<=0)return res.status(400).json({error:"Data not found"});
            return res.status(200).json({success:allData})
        } catch (error) {
            console.log(error);
        }
    }
   

}
module.exports=new checkIn();