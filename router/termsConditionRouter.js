const express = require("express");
const termsConditionController = require("../controller/termsConditionController")
const handleToken = require("../models/handleToken")

const router = express.Router();

router.get('/termscondition', termsConditionController.getTermsCondition);

router.patch('/termscondition', handleToken, termsConditionController.editTermsCondition);

module.exports = router;