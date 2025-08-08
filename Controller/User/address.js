
const { isValid, phonenumber, isValidNum, isValidString, isValidEmail } = require('../../Config/function')
const addressModel = require('../../Model/User/address');

class shippingAddress {
    async addShippingAddress(req, res) {
        try {
            const { fullName, number, anumber ,pincode, email, state, city, street,  userId ,country,lat,lng} = req.body;
            console.log("object",req.body)

            if (!isValid(fullName)) return res.status(400).json({ error: "Name is required!" });
            if (!isValidString(fullName)) return res.status(400).json({ error: "Name should be alphabets minmum size 3-25!" });

            if (!isValid(number)) return res.status(400).json({ error: "Mobile number is required!" });
            if (!phonenumber(number)) return res.status(400).json({ error: "Invalid mobile number!" });
  if (!isValid(anumber)) return res.status(400).json({ error: "Alternative mobile number is required!" });
            if (!phonenumber(anumber)) return res.status(400).json({ error: "Invalid Alternative mobile number!" });
            if (!isValid(email)) return res.status(400).json({error:"Email id is required!"});
            if(!isValidEmail(email)) return res.status(400).json({error:"inValid email id!"});
            if (!isValid(street)) return res.status(400).json({ error: "Address is required!" });
            if (!isValid(state)) return res.status(400).json({ error: "State is required!" });
            if (!isValid(city)) return res.status(400).json({ error: "City is required!" });

            if (!isValid(pincode)) return res.status(400).json({ error: "Pin code is required!" });
            if (!/^[0-9]{6}$/.test(pincode)) return res.status(400).send({ error: "Invalid pin code" });


            if (!isValid(userId)) return res.status(400).json({ error: "userId is required!" });

            let data = await addressModel.create({ fullName, pincode, number, anumber ,email, state, city, street, userId,country,lat,lng });
            if (!data) return res.status(400).json({ success: "Something went worng" });
            return res.status(200).json({ success: "Successfully added Address" })
        } catch (err) {
            console.log(err);
            return res.json({error:err.message})
        }
    }

    async editShippingAddress(req, res) {
        try {
            const { addressId, fullName, number,anumber, email, pincode, state, city, street,country,lat,lng} = req.body;
            let obj = {lat,lng}
            if (fullName) {
                if (!isValidString(fullName)) return res.status(400).json({ error: "Name should be alphabets minmum size 3-25!" });
                obj["fullName"] = fullName
            }
            if (number) {
                if (!phonenumber(number)) return res.status(400).json({ error: "Invalid mobile number!" });
                obj["number"] = number
            }
            if (anumber) {
                if (!phonenumber(anumber)) return res.status(400).json({ error: "Invalid mobile number!" });
                obj["anumber"] = anumber
            }
            if (email) {
                if (!isValidEmail(email)) return res.status(400).json({ error: "Invalid email id!" });
                obj["email"] = email
            }
            if (state) {
                obj["state"] = state
            }
            if (city) {
                obj["city"] = city
            }
            if (street) {
                obj["street"] = street
            }
            if (pincode) {
                if (!/^[0-9]{6}$/.test(pincode)) return res.status(400).send({ error: "Invalid pin code" });
                obj["pincode"] = pincode
            }
            if(country){
                obj["country"]=country
            }
        
            let data = await addressModel.findOneAndUpdate({ _id: addressId }, { $set: obj }, { new: true });
            if (!data) return res.status(400).json({ success: "Something went worng" });
            return res.status(200).json({ success: "Successfully updated" })
        } catch (err) {
            console.log(err);
        }
    }

    async geShippingAddByUser(req, res) {
        try {
            let userId = req.params.id
            let finddata = await addressModel.find({ userId: userId })
            console.log(userId)
            if (finddata.length <= 0) return res.status(400).json({ error: "Data not found" });
            return res.status(200).json({ success: finddata })
        } catch (err) {
            console.log(err);
            return res.json({error:err.message, success:false})
        }
    }


    async deleteShippingAdd(req, res) {
        try {
            let addressId = req.params.id;
            let data = await addressModel.deleteOne({ _id: addressId });
            if (data.deletedCount <= 0) return res.status(400).json({ success: "Data not found" });
            return res.status(200).json({ success: "Successfully deleted" })
        } catch (err) {
            console.log(err);
        }
    }
    
    async getshippingAddById(req, res) {
        try {
            let addressId = req.params.addressId;

            let allData = await addressModel.findById(addressId);
            if (!allData) return res.status(400).json({ error: "Something went worng" });
            return res.status(200).json({ success:allData })
        } catch (err) {
            console.log(err);
        }
    }

    async getallShippingAdd(req, res) {
        try {
            let allData = await addressModel.find({});
            if (allData.length <= 0) return res.status(400).json({ error: "Data not found" });
            return res.status(200).json({ success: allData })
        } catch (err) {
            console.log(err);
        }
    }
}

module.exports = new shippingAddress()