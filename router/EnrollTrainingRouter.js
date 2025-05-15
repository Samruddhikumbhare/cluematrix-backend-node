const express = require("express");
const EnrollTrainingRouter = require("../controller/EnrollTrainingRouter");
const handleToken = require("../models/handleToken");
const { storage } = require("../models/uploadPhoto");
const multer = require("multer");

const upload = multer({ storage: storage });

const router = express.Router();

router.get("/enrollTraining", EnrollTrainingRouter.getEnrollTrainingRouter);

router.post(
  "/enrollTraining",
  upload.fields([{ name: "resume", maxCount: 1 }]),
  EnrollTrainingRouter.createEnrollTrainingRouter
);

module.exports = router;
