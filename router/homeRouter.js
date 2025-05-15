const express = require("express");
const homeController = require("../controller/home/homeBannerController");
const homeAboutController = require("../controller/home/homeAboutController");
const handleToken = require("../models/handleToken");
const { storage } = require("../models/uploadPhoto");
const multer = require("multer");

const upload = multer({ storage: storage });

const router = express.Router();

router.get("/banner", homeController.getBanner);

router.post(
  "/banner",
  upload.fields([
    { name: "backImg", maxCount: 1 },
    { name: "frontImg", maxCount: 1 },
  ]),
  handleToken,
  homeController.createBanner
);

router.patch(
  "/banner",
  upload.fields([
    { name: "backImg", maxCount: 1 },
    { name: "frontImg", maxCount: 1 },
  ]),
  handleToken,
  homeController.editBanner
);

router.get("/about", homeAboutController.getAbout);

router.post(
  "/about",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "image2", maxCount: 1 },
  ]),
  handleToken,
  homeAboutController.createAbout
);

router.patch(
  "/about",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "image2", maxCount: 1 },
  ]),
  handleToken,
  homeAboutController.editAbout
);

module.exports = router;
