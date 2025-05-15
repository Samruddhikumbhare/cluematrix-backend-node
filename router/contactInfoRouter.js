const express = require("express");
const ContactInfoController = require("../controller/contactInfoController")
const handleToken = require("../models/handleToken")

const router = express.Router();

router.get('/contactInfo', ContactInfoController.getContact);

router.patch('/contactInfo', handleToken, ContactInfoController.editContact);

module.exports = router;