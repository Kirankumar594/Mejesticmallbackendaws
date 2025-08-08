const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema.Types;

const blogsSchema = new Schema(
  {
    title: {
      type: String,
    
    },
    body1: {
      type: String,
  
    },
    body2: {
      type: String,
    },
    
    quotes: {
      type: String,
    },
    authorName: {
      type: String,
    },
   
    description: {
      type: String,
    },
    authorImg:{
      type:String
    },
    authorId:{
      type:String
    },
    tags: { 
      type: String 
    },
    category: { 
      type: String 
    },
    subcategory: {
       type: String
       },
    image: { type: String },
    image1: { type: String },
    video: { type: String },
    video1: { type: String },
 
    tranding: {
      type: Boolean,
      default: false,
    },
    count: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);
const blogModel = mongoose.model("blog", blogsSchema);
module.exports = blogModel;
