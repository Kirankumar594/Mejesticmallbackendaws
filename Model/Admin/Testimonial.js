const mongoose = require("mongoose");

const TestimonialSchema = new mongoose.Schema(
  {   
    name: {
      type: String,
      required: true, 
    },
    profession: {
      type: String,
      required: true, 
    },
    message: {
      type: String,
      required: true, 
    },
    rating: {
      type: Number,
      required: true, 
      min: 1,
      max: 5, 
    },
    profileImage: {
      type: String, 
    }
  },
  { timestamps: true }
);

const TestimonialModel = mongoose.model("Testimonial", TestimonialSchema);
module.exports = TestimonialModel;
