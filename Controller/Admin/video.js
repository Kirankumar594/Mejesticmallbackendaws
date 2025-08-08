const videoModel=require('../../Model/Admin/video');

class Video{
    async addVideo(req,res){
        try {
            const {name}=req.body;
            let obj={name}
            if (req.files.length != 0) {
                let arr = req.files
                let i
                for (i = 0; i < arr.length; i++) {
                    if (arr[i].fieldname == "video") {
                        obj["video"] = arr[i].filename
                    }
                }}else {return res.status(400).json({error:"Video is required!"})}

            let data=await videoModel.create(obj);
            if(!data) return res.status(400).json({error:"Something went worng!"});
            return res.status(200).json({success:"Successfuly added"})
        } catch (error) {
            console.log(error);
        }
    }
    async  deleteVideo(req,res){
        try {
            let videoId=req.params.videoId;
            let data=await videoModel.deleteOne({_id:videoId});
            if(data.deletedCount<=0) return res.status(400).json({error:"Data not found!"});
            return res.status(200).json({success:data});
        } catch (error) {
            console.log(error);
        }
    }
    async getAllVideo(req,res){
        try {
            let data =await videoModel.find({})
            if(data.length<=0) return res.status(400).json({error:"Something went worng!"});
            return res.status(200).json({success:data})
        } catch (error) {
            console.log(error);
        }
    }
}
module.exports=new Video()