const forebaseconfigModel = require("../../Model/Admin/Firebaseconfig");

class FirebaseConfig {
  async addfirebaseconfig(req, res) {
    let { apiKey,authDomain,projectId, storageBucket, messagingSenderId, appId ,measurementId,vapidKey,googleApi,jwtKey,cryptoKey} = req.body;
   
   let check=await forebaseconfigModel.findOne();
   if(check){
       if(apiKey){
             check.apiKey=apiKey
       }
        if(authDomain){
            check.authDomain=authDomain
        }
        if(projectId){
              check.projectId=projectId 
        }
       if(storageBucket){
        check.storageBucket=storageBucket
        }
        if(messagingSenderId){
        check.messagingSenderId=messagingSenderId
        }
        if(appId){
         check.appId=appId
        }
        if(measurementId){
         check.measurementId=measurementId
        }
        if(vapidKey){
         check.vapidKey=vapidKey
        }
        if(googleApi){
         check.googleApi=googleApi
        }
        if(jwtKey){
         check.jwtKey=jwtKey
        }
        if(cryptoKey){
         check.cryptoKey=cryptoKey
        }
        check=await check.save();
        
         return res.status(200).json({ sucess: "Firebase update successfully" });
   }else {
        let add = new forebaseconfigModel({apiKey,authDomain,projectId, storageBucket, messagingSenderId, appId ,measurementId,vapidKey ,googleApi,jwtKey,cryptoKey});
    let save = add.save();
    if (save) {
      return res.status(200).json({ sucess: "Firebase added successfully" });
     
    }
   }
   
  }

  async getfirebaseconfig(req, res) {
    let data = await forebaseconfigModel.findOne();
    if(data){
            const payload = JSON.stringify(data);
      let objJsonB64 = Buffer.from(payload).toString("base64");
      return res.status(200).json({ data: objJsonB64 });
    }else{
        return res.status(400).json({error:"Data not found"});
    }

  }


 

 async postdeleteFirese(req, res) {
  try {
    let id = req.params.id;
    const data = await forebaseconfigModel.deleteOne({ _id: id });

    if (data.deletedCount === 1) {
      return res.json({ success: "Successfully deleted" });
    } else {
      return res.status(404).json({ error: "Text not found" });
    }
  } catch (error) {
    console.error("Error deleting Text:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
async makeactivedfirebase(req,res){
    try{
        let {id}=req.params;
     
        let data=await forebaseconfigModel.findById(id);
        if(!data) return res.status(400).json({error:'Data not found'});
        if(data.isActive==true){
            data.isActive=false
        }else{
             data.isActive=true
        }
        
        data=await data.save()
        return res.status(200).json({success:`Successfully updated`})
    }catch(error){
        console.log(error)
    }
}


}

module.exports = new FirebaseConfig();

