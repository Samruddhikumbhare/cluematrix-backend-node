const express = require("express");
const testimonialController = require("../controller/testimonialsController");
const handleToken = require("../models/handleToken");
const { storage } = require("../models/uploadPhoto");
const multer = require("multer");

const upload = multer({ storage: storage });

const router = express.Router();

router.get("/testimonials", testimonialController.getTestimonial);

router.patch(
  "/testimonials",
  upload.fields([{ name: "image", maxCount: 500 }]),
  handleToken,
  testimonialController.editTestimonial
);

module.exports = router;
