const express = require("express");
const router = express.Router();
const vehicleController = require("../../Controller/User/vehicle");
const multer = require("multer");

// Multer storage configuration
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "/home/parnetsl1b/public_html/Public/driver"); // Ensure this path exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname); // Create a unique filename
  },
});

// Multer upload instance
const upload = multer({ storage: storage });

// Define routes using multer upload
router.post("/registerVehicle", upload.any(), vehicleController.addVehicle);
router.put("/editVehicle", upload.any(), vehicleController.updateVehicle);
router.post("/getVehicleByQuery", vehicleController.getVehicleByQuery);
router.get("/getAllVehicle", vehicleController.getAllVehicle);
router.get("/getVehicleById/:vehicleId", vehicleController.getVehicleById);
router.get("/getVehicleByTransportId/:transporterId", vehicleController.getVehicleByTransportId);
router.delete("/deleteVehicle/:vehicleId", vehicleController.deleteVehicle);

module.exports = router;
