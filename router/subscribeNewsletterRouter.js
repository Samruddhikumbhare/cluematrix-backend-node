const express = require("express");
const subscribeNewsletterController = require("../controller/subscribeNewsletterController")
const handleToken = require("../models/handleToken")

const router = express.Router();

router.get('/subscribenewsletter', handleToken, subscribeNewsletterController.getSubscribe);

router.post('/subscribenewsletter', subscribeNewsletterController.createSubscribe);

router.delete('/subscribenewsletter', handleToken, subscribeNewsletterController.deleteSubscribe);


module.exports = router;