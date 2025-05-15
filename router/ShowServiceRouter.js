const express = require("express");
const ShowServiceController = require("../controller/ShowServiceController");
const handleToken = require("../models/handleToken");
const { storage } = require("../models/uploadPhoto");
const multer = require("multer");

const upload = multer({ storage: storage });

const router = express.Router();

router.get("/showService", ShowServiceController.getShowService);

router.post(
  "/showService",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "image2", maxCount: 1 },
  ]),
  handleToken,
  ShowServiceController.createShowService
);

router.patch(
  "/showService",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "image2", maxCount: 1 },
  ]),
  handleToken,
  ShowServiceController.editShowService
);

module.exports = router;
