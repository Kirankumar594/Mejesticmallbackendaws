const imageModel=require('../../Model/Admin/image');

class image{
    async addImage(req,res){
        try {
            const {name}=req.body;
            let obj={name}
            if (req.files.length != 0) {
                let arr = req.files
                let i
                for (i = 0; i < arr.length; i++) {
                    if (arr[i].fieldname == "image") {
                        obj["image"] = arr[i].filename
                    }
                }}else {return res.status(400).json({error:"Image required!"})}

            let data=await imageModel.create(obj);
            if(!data) return res.status(400).json({error:"Something went worng!"});
            return res.status(200).json({success:"Successfuly added"})
        } catch (error) {
            console.log(error);
        }
    }
    async  deleteImage(req,res){
        try {
            let imageId=req.params.imageId;
            let data=await imageModel.deleteOne({_id:imageId});
            if(data.deletedCount<=0) return res.status(400).json({error:"Data not found!"});
            return res.status(200).json({success:data});
        } catch (error) {
            console.log(error);
        }
    }
    async getAllImage(req,res){
        try {
            let data =await imageModel.find({})
            if(data.length<=0) return res.status(400).json({error:"Something went worng!"});
            return res.status(200).json({})
        } catch (error) {
            console.log(error);
        }
    }
}
module.exports=new image()