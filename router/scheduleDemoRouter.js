const express = require("express");
const scheduleDemoController = require("../controller/scheduleDemoController")
const handleToken = require("../models/handleToken")

const router = express.Router();

router.get('/scheduledemo', handleToken, scheduleDemoController.getScheduleDemo);

router.post('/scheduledemo', scheduleDemoController.createScheduleDemo);

router.delete('/scheduledemo', handleToken, scheduleDemoController.deleteScheduleDemo);


module.exports = router;