const express = require("express");
const JourneyController = require("../controller/JourneyController")
const handleToken = require("../models/handleToken")

const router = express.Router();

router.get('/journey', JourneyController.getJourney);

router.patch('/journey', handleToken, JourneyController.editJourney);

module.exports = router;