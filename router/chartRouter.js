const express = require("express");
const chartController = require("../controller/chartController")
const handleToken = require("../models/handleToken")

const router = express.Router();

router.post('/chart', handleToken, chartController.getYear);

module.exports = router;