
const {phonenumber,isValidString,isValidEmail,isValid,isValidPassword, isValidObjectId}=require('../../Config/function');
const vehicleModel=require("../../Model/User/vehicle");

class vehicle{
    async addVehicle(req,res){
        try {
            const {brand,mudel,location,capacity,size,speed,priceOneKm,state,city,pincode,number,email,time,driverName,transporterId,adminId}=req.body;
            let obj={brand,mudel,location,capacity,size,speed,number,email,time, priceOneKm,state,city,pincode,driverName,transporterId,adminId}
            if (!isValid(brand)) return res.status(400).json({ error: "Brand name is required!" });
            if (!isValid(mudel)) return res.status(400).json({ error: "Model is required!" });

            if (!isValid(location)) return res.status(400).json({ error: "Location is required!" });
            if (!isValid(capacity)) return res.status(400).json({ error: "Capacity is required!" });

            if (!isValid(size)) return res.status(400).json({ error: "Size is required!" });
            if (!isValid(speed)) return res.status(400).json({ error: "Speed is required!" });
            
            if (!isValid(time)) return res.status(400).json({ error: "Time is required!" });
            if (!isValid(driverName)) return res.status(400).json({ error: "Drive name is required!" });
            if (!isValidString(driverName)) return res.status(400).json({ error: "Drive name should be alphabets minmum size 3-25!" });
            if (!isValid(priceOneKm)) return res.status(400).json({ error: "Price is required!" });
            if (!isValid(number)) return res.status(400).json({ error: "Mobile number is required!" });
            if (!phonenumber(number)) return res.status(400).json({ error: "Invalid mobile number!" });
           
            if (!isValid(email)) return res.status(400).json({ error: "Email id is required!" });
            if (!isValidEmail(email)) return res.status(400).json({ error: "Invalid email id!" });
            if (!isValid(state)) return res.status(400).json({ error: "State is required!" });
            if (!isValid(city)) return res.status(400).json({ error: "City is required!" });
            if (!isValid(pincode)) return res.status(400).json({ error: "Pincode is required!" });

            if (req.files.length != 0) {
                let arr = req.files
                let i
                for (i = 0; i < arr.length; i++) {
                    if (arr[i].fieldname == "vehicleImage") {
                        obj["vehicleImage"] = arr[i].filename
                    }
                }}else {return res.status(400).json({error:"Vehicle image required"})}

                if (req.files.length != 0) {
                    let arr = req.files
                    let i
                    for (i = 0; i < arr.length; i++) {
                        if (arr[i].fieldname == "driverImage") {
                            obj["driverImage"] = arr[i].filename
                        }
                    }}

          if(!isValid(transporterId)||!isValid(adminId)) return res.status(400).json({error:"One id is  required!"})
        
          let data=await vehicleModel.create(obj);
          if(!data) return res.status(400).json({error:"Something went worng"});
          return res.status(200).json({success:"Successfully added"})



        } catch (error) {
            console.log(error);
        }
    }
    async updateVehicle(req,res){
        try {
            const {vehicleId,brand,mudel,location,capacity,size,priceOneKm,speed,number,email,time,driverName,state,city,pincode}=req.body;   
            if(!isValid(vehicleId)) return res.status(400).json({error:"Vehicle id is required!"})
            let obj={}
            if(brand){
                obj["brand"]=brand;
            }
            if(mudel){
                obj["model"]=mudel;
            }
            if(priceOneKm){
                obj["price"]=priceOneKm;
            }
            if(location){
                obj["location"]=location;
            }
            if(capacity){
                obj["capacity"]=capacity;
            }
            if(size){
                obj["size"]=size;
            }
            if(speed){
                obj["speed"]=speed;
            }
            if(number){
                obj["number"]=number;
            }
            if(email){
                obj["email"]=email;
            }
            if(time){
                obj["time"]=time;
            }
            if(driverName){
                obj["driverName"]=driverName;
            }
            if(state){
                obj["state"]=state;
            } 
            if(city){
                obj["city"]=city;
            }
            if(pincode){
                obj["pincode"]=pincode;
            }
            if (req.files.length != 0) {
                let arr = req.files
                let i
                for (i = 0; i < arr.length; i++) {
                    if (arr[i].fieldname == "vehicleImage") {
                        obj["vehicleImage"] = arr[i].filename
                    }
                    if (arr[i].fieldname == "driverImage") {
                        obj["driverImage"] = arr[i].filename
                    }
                }}
            let update=await vehicleModel.findOneAndUpdate({_id:vehicleId},{$set:obj},{new:true})
                if(!update) return res.status(400).json({error:"Something went worng!"});
                return res.status(200).json({success:"Successfully updated"});

        } catch (error) {
            console.log(error);
        }
    }
    async getAllVehicle(req,res){
        try {
            let allData=await vehicleModel.find({}).populate("transporterId");
            if(allData.length<=0)return res.status(400).json({error:"Data not found"});
            return res.status(200).json({success:allData})
        } catch (error) {
            console.log(error);
        }
    }
    async getVehicleByQuery(req,res){
        try {
            const {brand,mudel,location,capacity,size,priceOneKm,speed,number,email,time,driverName,state,city,pincode}=req.body;   
            let obj={}
            if(brand){
                obj["brand"]=brand;
            }
            if(mudel){
                obj["model"]=mudel;
            }
            if(priceOneKm){
                obj["price"]=priceOneKm;
            }
            if(location){
                obj["location"]=location;
            }
            if(capacity){
                obj["capacity"]=capacity;
            }
            if(size){
                obj["size"]=size;
            }
            if(speed){
                obj["speed"]=speed;
            }
            if(time){
                obj["time"]=time;
            }
            if(state){
                obj["state"]=state;
            } 
            if(city){
                obj["city"]=city;
            }
            if(pincode){
                obj["pincode"]=pincode;
            }
        let getData=await vehicleModel.find(obj).sort({priceOneKm:1});
        if(getData.length<=0){
            getData=await vehicleModel.find({$or:[{pincode:pincode},{city:city},{pincode:pincode}]}).sort({priceOneKm:1})
        }
        return res.status(200).json({success:getData});
        } catch (error) {
            console.log(error);
        }
    }
    async getVehicleById(req,res){
        try {
            let vehicleId=req.params.vehicleId;
            let data=await vehicleModel.findById(vehicleId);
            if(!data) return res.status(400).json({error:"Something went worng!"})
            return res.status(200).json({success:data})
        } catch (error) {
            console.log(error);
        }
    }

    async getVehicleByTransportId(req,res){
        try {
            let transporterId=req.params.transporterId;
            let getdata=await vehicleModel.find({transporterId:transporterId}).sort({_id:-1});
            if(getdata.length<=0) return res.status(400).json({error:"Data not found"});
            return res.status(200).json({success:getdata});
        } catch (error) {
            console.log(error);
        }
    }
    async deleteVehicle(req,res){
        try {
            let vehicleId=req.params.vehicleId;
            let data=await vehicleModel.deleteOne({_id:vehicleId});
            if(data.deletedCount<=0) return res.status(400).json({error:"Data not found!"})
            return res.status(200).json({success:"Successfully deleted"})
        } catch (error) {
            console.log(error);
        }
    }

}
module.exports=new vehicle();