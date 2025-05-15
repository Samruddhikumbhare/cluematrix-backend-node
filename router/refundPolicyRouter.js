const express = require("express");
const refundPolicyController = require("../controller/refundPolicyController")
const handleToken = require("../models/handleToken")

const router = express.Router();

router.get('/refundpolicy', refundPolicyController.getRefundPolicy);

router.patch('/refundpolicy', handleToken, refundPolicyController.editRefundPolicy);

module.exports = router;