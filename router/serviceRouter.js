const express = require("express");
const serviceController = require("../controller/serviceController");
const handleToken = require("../models/handleToken");
const { storage } = require("../models/uploadPhoto");
const multer = require("multer");

const upload = multer({ storage: storage });

const router = express.Router();

router.get("/service", serviceController.getService);

router.post(
  "/service",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "icon", maxCount: 1 },
  ]),
  handleToken,
  serviceController.addService
);

router.patch(
  "/service",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "icon", maxCount: 1 },
  ]),
  handleToken,
  serviceController.editService
);

router.delete("/service", serviceController.deleteService);

module.exports = router;
