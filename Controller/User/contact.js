const { isValid, phonenumber, isValidEmail, isValidString, isValidObjectId, validUrl } = require('../../Config/function')
const contactModel = require('../../Model/User/contact');

class contact {
    async createContact(req, res) {
        try {
            const { fullName, number, email, text, userName, userImg, userId,address} = req.body;

            if (!isValid(fullName)) return res.status(400).json({ error: "Name is required!" });
            if (!isValidString(fullName)) return res.status(400).json({ error: "Name should be alphabets minmum size 3-25!" });

            if (!isValid(number)) return res.status(400).json({ error: "Mobile number is required!" });
            if (!phonenumber(number)) return res.status(400).json({ error: "Invalid mobile number!" });
            if(!isValid(email)) return res.status(400).json({ error: "Email is required!" });
            if(!isValidEmail(email))  return res.status(400).json({ error: "inValid email id!" });
          if (!isValid(text)) return res.status(400).json({ error: "Text is required!" });
        
            if (!isValid(userId)) return res.status(400).json({ error: "userId is required!" });
            let obj = {fullName, number, email, text, listId, userName,address, userImg, userId}
         
            let data = await contactModel.create(obj);
            if (!data) return res.status(400).json({ error: "Something went worng" });
            return res.status(200).json({ success: "Team will be contact as soon as." })
        } catch (err) {
            console.log(err);
        }
    }

    async editContact(req, res) {
        try {
            const { contactId, fullName, number, email, text,address } = req.body;
            let obj = {}
            if (fullName) {
                if (!isValidString(fullName)) return res.status(400).json({ error: "Name should be alphabets minmum size 3-25!" });
                obj["fullName"] = fullName
            }
            if (number) {
                if (!phonenumber(number)) return res.status(400).json({ error: "Invalid mobile number!" });
                obj["number"] = number
            }
            if (email) {
                if (!isValidEmail(email)) return res.status(400).json({ error: "Invalid email id!" });
                obj["email"] = email
            }
            if (text) {
                obj["text"] = text
            }
            if(address){
                obj["address"]=address
            }
           
            let data = await contactModel.findOneAndUpdate({ _id: contactId }, { $set: obj }, { new: true });
            if (!data) return res.status(400).json({ success: "Something went worng" });
            return res.status(200).json({ success: "Successfully updated" })
        } catch (err) {
            console.log(err);
        }
    }

    async getContactByUser(req, res) {
        try {
            let userId = req.params.userId
            let finddata = await contactModel.find({ userId: userId })
            if (finddata.length <= 0) return res.status(200).json({ success: "Data not found" });
            return res.status(200).json({ success: finddata })
        } catch (err) {
            console.log(err);
        }
    }

  

    async deleteContact(req, res) {
        try {
            let contactId = req.params.contactId;
            let data = await contactModel.deleteOne({ _id: contactId });
            if (data.deletedCount <= 0) return res.status(200).json({ success: "Data not found" });
            return res.status(200).json({ success: "Successfully deleted" })
        } catch (err) {
            console.log(err);
        }
    }
  
    async getallContact(req, res) {
        try {
            let allData = await contactModel.find({})
            if (allData.length <= 0) return res.status(200).json({ success: "Data not found" });
            return res.status(200).json({ success: allData })
        } catch (err) {
            console.log(err);
        }
    }
    async makeStatusChangeContact(req, res) {
        try {
            const { status, contactId } = req.body
            let allData = await contactModel.findOneAndUpdate({ _id: contactId }, { $set: { status: status } }, { new: true });
            if (!allData) return res.status(200).json({ success: "Something went worng" });
            return res.status(200).json({ success: "Successfully changed" })
        } catch (err) {
            console.log(err);
        }
    }

}

module.exports = new contact()