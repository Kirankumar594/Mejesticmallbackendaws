const testimonialModel = require("../../Model/Admin/Testimonial");

class Testimonial {
  async addTestimonial(req, res) {
    let { name, profession, message, rating } = req.body;
    let profileImage = req.file ? req.file.filename : null;

    let add = new testimonialModel({
      name,
      profession,
      message,
      rating,
      profileImage,
    });

    try {
      let save = await add.save();
      return res.json({
        success: "Testimonial added successfully",
        data: save,
      });
    } catch (error) {
      return res.status(500).json({ error: "Failed to add testimonial" });
    }
  }

  async getTestimonial(req, res) {
    try {
      let testimonials = await testimonialModel.find({});
      return res.json({ testimonials });
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch testimonials" });
    }
  }

  async updateTestimonial(req, res) {
    const id = req.params.id;
    let { name, profession, message, rating } = req.body;
    let obj = {};

    if (name) obj["name"] = name;
    if (profession) obj["profession"] = profession;
    if (message) obj["message"] = message;
    if (rating) obj["rating"] = rating;
    if (req.files.length != 0) {
        let arr = req.files;
        let i;
        for (i = 0; i < arr.length; i++) {
          if (arr[i].fieldname == "profileImage") {
            obj["profileImage"] = arr[i].filename;
          }
         
        }
    }

    try {
      await testimonialModel.findByIdAndUpdate(
        id,
        { $set: obj },
        { new: true }
      );
      return res.json({ success: "Testimonial updated successfully" });
    } catch (error) {
      return res.status(500).json({ error: "Failed to update testimonial" });
    }
  }

  async deleteTestimonial(req, res) {
    try {
      const id = req.params.id;
      const data = await testimonialModel.deleteOne({ _id: id });

      if (data.deletedCount === 1) {
        return res.json({ success: "Testimonial deleted successfully" });
      } else {
        return res.status(404).json({ error: "Testimonial not found" });
      }
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}

const TestimonialController = new Testimonial();
module.exports = TestimonialController;
