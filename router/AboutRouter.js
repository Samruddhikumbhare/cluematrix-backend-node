const express = require("express");
const AboutController = require("../controller/AboutController")
const handleToken = require("../models/handleToken")
const { storage } = require("../models/uploadPhoto");
const multer = require('multer');

const upload = multer({ storage: storage });

const router = express.Router();

router.get('/about', AboutController.getAbout);

router.post('/about', upload.fields([
        { name: 'image', maxCount: 1 }
    ]), handleToken, AboutController.createAbout);

router.patch('/about', upload.fields([
        { name: 'image', maxCount: 1 }
    ]), handleToken, AboutController.editAbout);

module.exports = router;