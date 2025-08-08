const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  businessName: { type: String, },
  address: { type: String, },
  phoneNumber: { type: String, },
  email: { type: String, },
  businessId: { type: String, },
  gstNumber: { type: String,  },
  businesslogo: { type: String }, // File path for the logo
  description:{
      type:String
  }
}, { timestamps: true });

module.exports = mongoose.model('bussinessprofile', ProfileSchema);
