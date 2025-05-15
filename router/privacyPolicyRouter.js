const express = require("express");
const privacyPolicyController = require("../controller/privacyPolicyController")
const handleToken = require("../models/handleToken")

const router = express.Router();

router.get('/privacypolicy', privacyPolicyController.getPrivacyPolicy);

router.patch('/privacypolicy', handleToken, privacyPolicyController.editPrivacyPolicy);

module.exports = router;