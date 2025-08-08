const express = require("express");
const router = express.Router();
const blogController=require('../../Controller/User/blog')
const multer = require("multer");



var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "/home/parnetsl1b/public_html/Public/blog");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post("/addBlog", upload.any(), blogController.blogcreate);
router.get("/getblogs", blogController.getBlogs);
router.get("/blog/:blogId",blogController.getBlogsById);

router.put("/updateBlog/:blogId",upload.any(),blogController.updateBlog);

router.delete("blog/:blogId",blogController.deleteBlog);
router.get("/blogByCategory",blogController.getByCategorey);
router.get("/trandingBlog",blogController.blogTranding);
router.get("/blogSearch",blogController.blogSearch);
module.exports = router;
