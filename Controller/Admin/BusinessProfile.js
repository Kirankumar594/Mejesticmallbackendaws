const fs = require('fs');
const Profile = require("../../Model/Admin/BussinessProfile");
// Get Profile
exports.getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne();
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.status(200).json({profile});
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile', error });
  }
};

// Update Profile
exports.updateProfile = async (req, res) => {
  try {
    const { businessName,address, phoneNumber,email,businessId,gstNumber,description}=req.body ;
    let data={ businessName,address, phoneNumber,email,businessId,gstNumber,description};
 
      if (req.files && req.files.length !== 0) {
      let arr = req.files;
      let i;

      for (i = 0; i < arr.length; i++) {
        if (arr[i].fieldname === "businesslogo") {
          data["businesslogo"] = arr[i].filename?.replace(/\s+/g, "_");;
        }
      }
    }
  

    let profile = await Profile.findOne();
    if (profile) {
      // Update existing profile
      profile = await Profile.findByIdAndUpdate(profile._id, {$set:data}, { new: true });
    } else {
      // Create a new profile
      profile = await Profile.create(data);
    }

    res.status(200).json({ message: 'Profile updated successfully!', profile });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error });
  }
};

// Delete Logo
exports.deleteLogo = async (req, res) => {
  try {
    const profile = await Profile.findOne();
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    if (profile.logo) {
      const logoPath = profile.logo.replace('/uploads/', 'uploads/');
      fs.unlink(logoPath, (err) => {
        if (err) console.error('Error deleting logo file:', err);
      });
    }

    profile.logo = null;
    await profile.save();
    res.status(200).json({ message: 'Logo deleted successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting logo', error });
  }
};
