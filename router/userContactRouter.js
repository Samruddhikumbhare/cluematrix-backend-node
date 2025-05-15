const express = require("express");
const userContactController = require("../controller/userContactController")
const handleToken = require("../models/handleToken")

const router = express.Router();

router.get('/usercontact', handleToken, userContactController.getUserContact);

router.post('/usercontact', userContactController.createUserContact);

router.delete('/usercontact', handleToken, userContactController.deleteUserContact);


module.exports = router;