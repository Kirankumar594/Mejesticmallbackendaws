const blogModel = require("../../Model/User/blog");
const { isValid, isValidNum, isValidObjectId, isValidString, phonenumber, validUrl, isValidEmail } = require('../../Config/function')

class blogcreate {

  async blogcreate(req, res) {
    try {
      let {
        title,
        body1,
        body2,
        authorImg,
        quotes,
        authorName,
        description,
        tag,
        category,
        subcategory,
        authorId
      } = req.body;
      if (!isValid(title)) return res.status(400).json({ error: "Title is required!" });

      if (!isValid(category)) return res.status(400).json({ error: "Category is required!" });
      if (!isValid(subcategory)) return res.status(400).json({ error: "Subcategory is required!" });

      let obj = {
        title,
        body1,
        body2,
        quotes,
        authorName,
        authorImg,
        description,
        tag,
        category,
        subcategory,
        authorId
      };
      if (req.files.length != 0) {
        let arr = req.files;
        let i;
        for (i = 0; i < arr.length; i++) {
          if (arr[i].fieldname == "image") {

            obj["image"] = arr[i].filename;
          }
          if (arr[i].fieldname == "image1") {
            obj["image1"] = arr[i].filename;
          }
          if (arr[i].fieldname == "video") {
            obj["video"] = arr[i].filename;
          }
          if (arr[i].fieldname == "video1") {
            obj["video1"] = arr[i].filename;
          }
        }
      }
      let blogs = new blogModel(obj);
      blogs.save().then((data) => {
        console.log(data);
        return res.status(200).json({ Success: "Successfully blogs posted" });
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  async getBlogs(req, res) {
    let blogList = await blogModel
      .find({})
      .sort({ _id: -1 })
    if (blogList) {
      return res.status(200).json({ blog: blogList });
    }
  }


  async getBlogsById(req, res) {
    try {
      let blogId = req.params.blogId;
      if (!isValidObjectId(blogId))return res.status(400).json({ status: false, msg: "blog id is not valid" });
      let blogone = await blogModel.findById(blogId);
    
      if (!blogone)
        return res
          .status(404)
          .json({ status: false, msg: "blog is not Found" });

      if (blogone.count != 10) {
        await blogModel.findByIdAndUpdate(
          { _id: blogId },
          { $set: { count: blogone.count + 1 } },
          { new: true }
        );
      } else {
        await blogModel.findOneAndUpdate(
          { _id: blogId },
          { $set: { tranding: true } },
          { new: true }
        );
      }
      return res.status(200).json({ status: true, msg: blogone });
    } catch (err) {
      console.log(err);
    }
  }


  async updateBlog(req, res) {
    try {
      let blogId = req.params.blogId;
      if (!isValidObjectId(blogId))
        return res
          .status(400)
          .json({ status: false, msg: "Blog id is not valid" });
      let {
        title,
        body1,
        body2,
        quotes,
        authorName,
        description,
        tag,
        category,
        subcategory,
        tranding,
      } = req.body;

      let obj = {};
      if (title) {
        obj["title"] = title;
      }
      if (body1) {
        obj["body1"] = body1;
      }
      if (body2) {
        obj["body2"] = body2;
      }
      if (quotes) {
        obj["quotes"] = quotes;
      }
      if (authorName) {
        obj["authorName"] = authorName;
      }
      if (description) {
        obj["description"] = description;
      }
      if (tag) {
        obj["tag"] = tag;
      }
      if (category) {
        obj["category"] = category;
      }
      if (subcategory) {
        obj["subcategory"] = subcategory;
      }

      if (req.files.length != 0) {
        let arr = req.files;
        let i;
        for (i = 0; i < arr.length; i++) {
          if (arr[i].fieldname == "image" ) {
            obj["image"] = arr[i].filename;
          }
          if (arr[i].fieldname == "image1" ) {
            obj["image1"] = arr[i].filename;
          }
          if (arr[i].fieldname == "video" ) {
            obj["video"] = arr[i].filename;
          }
          if (arr[i].fieldname == "video1" ) {
            obj["video1"] = arr[i].filename;
          }
        }
      }
      if (tranding) {
        obj["tranding"] = tranding;
      }

      let blogubdate = await blogModel.findOneAndUpdate(
        { _id: blogId },
        { $set: obj },
        { new: true }
      );
      if (!blogubdate)
        return res
          .status(400)
          .json({ error: "Samething went worng" });

      return res
        .status(200)
        .json({ success: "Successfully updated blog" });
    } catch (err) {
      console.log(err);
    }
  }

  async deleteBlog(req, res) {
    try {
      let blogId = req.params.blogId;
      if (!isValidObjectId(blogId))
        return res
          .status(400)
          .json({ error: "Blog id is not valid" });
      let check = await blogModel.deleteOne(blogId);

      if (check.deletedCount == 0) {
        return res
          .status(400)
          .json({ error: "Blog is already delete" });
      } else {
        return res
          .status(200)
          .json({  success: "Blog  Successfully deleted" });
      }
    } catch (err) {
      console.log(err);
    }
  }

  async getByCategorey(req, res) {
    try {
      let category = req.query.category;
      let blog = await blogModel.find({ category: category });
      if (blog.length <= 0)
        return res.status(404).json({ error: "blog not found" });

      return res
        .status(200)
        .json({count: blog.length, data: blog });
    } catch (err) {
      console.log(err.message);
    }
  }


  async blogTranding(req, res) {
    try {
      let trandBlog = await blogModel
        .find({ tranding: true })
        .sort({ _id: -1 });
      if (trandBlog.length <= 0)
        return res.status(404).json({ error: "No tranding Blog" });
      return res
        .status(200)
        .json({ count: trandBlog.length, data: trandBlog });
    } catch {
      err;
    }
    {
      console.log(err.message);
    }
  }
  
  async blogSearch(req, res) {
    try {
      const { text } = req.body;
      if (!isValid(text)) {
        let data = await blogModel.find({})
        return res.status(200).json({ success: data })
      }
      if (/^[A-Za-z]+$/.test(text)) {
        let findData = await blogModel.find({ category: { $regex: text, $options: 'i' } }).populate("UserId");
        if (findData.length <= 0) {
          findData = await blogModel.find({ $or: [{ subcategory: { $regex: text, $options: 'i' } }, { title: { $regex: text, $options: 'i' } }] }).populate("UserId");
        }
        return res.status(200).json({ success: findData })
      }
      let findData = await blogModel.find({ title: { $regex: text, $options: 'i' } }).populate("UserId");;
      return res.status(200).json({ success: findData })
    } catch (error) {
      console.log(error);
    }
  }
}
const blogController = new blogcreate();
module.exports = blogController;
