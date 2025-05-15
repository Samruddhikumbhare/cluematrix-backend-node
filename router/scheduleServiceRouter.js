const express = require("express");
const scheduleServiceController = require("../controller/scheduleServiceController");
const handleToken = require("../models/handleToken");
const { storage } = require("../models/uploadPhoto");
const multer = require('multer');

const upload = multer({ storage: storage });
const router = express.Router();

router.get(
  "/scheduleservice",
  handleToken,
  scheduleServiceController.getScheduleservice
);

router.post(
  "/scheduleservice",
  upload.fields([{ name: "document", maxCount: 1 }]),
  scheduleServiceController.createScheduleservice
);

router.delete(
  "/scheduleservice",
  handleToken,
  scheduleServiceController.deleteScheduleservice
);

module.exports = router;
