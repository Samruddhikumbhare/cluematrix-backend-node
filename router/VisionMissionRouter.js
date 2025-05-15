const express = require("express");
const VisionMissionController = require("../controller/VisionMissionController")
const handleToken = require("../models/handleToken")
const { storage } = require("../models/uploadPhoto");
const multer = require('multer');

const upload = multer({ storage: storage });

const router = express.Router();

router.get('/visionMission', VisionMissionController.getVisionMission);

router.post('/visionMission', upload.fields([
        { name: 'image', maxCount: 1 }
    ]), handleToken, VisionMissionController.createVisionMission);

router.patch('/visionMission', upload.fields([
    { name: 'image', maxCount: 1 }
]), handleToken, VisionMissionController.editVisionMission);

module.exports = router;