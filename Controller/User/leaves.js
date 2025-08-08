const leavesModel = require("../../Model/User/leaves");
const { phonenumber, isValidString, isValidEmail, isValid, isValidPassword, isValidObjectId } = require('../../Config/function')

class leaves {
    async addLeaves(req, res) {
        try {
            const { FromDate, ToDate, FromDay, ToDay, userName, LeaveType, userId, status } = req.body;
            let obj = { FromDate, ToDate, FromDay, ToDay, userName, LeaveType, userId, status }

            if (!isValid(userName)) return res.status(400).json({ error: "Name is required!" });
            if (!isValidString(userName)) return res.status(400).json({ error: "Name should be alphabets minmum size 3-25!" });


            if (!isValid(FromDate)) return res.status(400).json({ error: "From Date is required!" });
         

            if (!isValid(LeaveType)) return res.status(400).json({ error: "Leave Type is required!" });
           

            if (!isValid(ToDate)) return res.status(400).json({ error: "To Date is required!" });

          
            if (!isValid(userId)) return res.status(400).json({ error: "User Id is required!" });

           


            let data = await leavesModel.create(obj)
            if (!data) return res.status(400).json({ error: "Something went worng!" })
            return res.status(200).json({ success: "Successfully Applied" })
        } catch (error) {
            console.log(error);
        }
    }
   

    async getAllleaves(req, res) {
        try {
             let data = await leavesModel.find().sort({_id:-1});
           
            if (data.length <= 0) return res.status(400).json({ error: "Data not found!" });
            return res.status(200).json({ success: data });
        } catch (error) {
            console.log(error);
        }
    }
  
    async getleavesByUserId(req, res) {
        try {
            let userId = req.params.userId;
            let data = await leavesModel.find({ userId: userId }).sort({_id:-1});
            
            if (data.length <= 0) return res.status(400).json({ error: "Something went worng!" });
            return res.status(200).json({ success: data })
        } catch (error) {
            console.log(error);
        }
    }
   
  async changeleavesStatus(req, res) {
        try {
            const { status, leavesId } = req.body;
            
            if (!isValidObjectId(leavesId)) {
                return res.status(400).json({ error: "Invalid leave ID" });
            }

            const leave = await leavesModel.findByIdAndUpdate(
                leavesId,
                {
                    status,
                    approvalDate: new Date()
                },
                { new: true }
            );

            if (!leave) {
                return res.status(404).json({ error: "Leave request not found" });
            }

            // Send notification to the user about leave status
            // await sendNotification({
            //     userId: leavesModel.userId,
            //     title: 'Leave Request Update',
            //     message: `Your leave request has been ${status.toLowerCase()}`,
            //     type: 'leave_status_update'
            // });

            return res.status(200).json({ success: "Leave status updated successfully" });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Internal server error" });
        }
    }
    async deleteleaves(req,res){
        try {
            let leavesId=req.params.leavesId;
            let data=await leavesModel.deleteOne({_id:leavesId});
            if(data.deletedCount<=0) return res.status(400).json({error:"Data not found"});
            return res.status(200).json({success:"Successfully deleted!"});
        } catch (error) {
            console.log(error);
        }
    }
     async getLeaveNotifications(req, res) {
        try {
            const { userId } = req.params;

            if (!isValidObjectId(userId)) {
                return res.status(400).json({ error: "Invalid user ID" });
            }

            const notifications = await leavesModel.find({ userId })
                .select('status FromDate ToDate LeaveType createdAt approvalDate')
                .sort({ createdAt: -1 })
                .limit(20);

            return res.status(200).json(notifications);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Internal server error" });
        }
    }
}
module.exports = new leaves()