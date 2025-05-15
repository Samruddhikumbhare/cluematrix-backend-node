const express = require("express");
const eventController = require("../controller/eventController");
const handleToken = require("../models/handleToken");
const { storage } = require("../models/uploadPhoto");
const multer = require("multer");

const upload = multer({ storage: storage });

const router = express.Router();

router.get("/event", eventController.getEvent);

router.post(
  "/event",
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "video", maxCount: 1 },
    { name: "images", maxCount: 500 },
  ]),
  handleToken,
  eventController.addEvent
);

router.patch(
  "/event",
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "video", maxCount: 1 },
    { name: "images", maxCount: 500 },
  ]),
  handleToken,
  eventController.editEvent
);

router.delete("/event", eventController.deleteEvent);

module.exports = router;
