const express = require("express");
const authenticateController = require("../controller/authenticateController")
const handleToken = require("../models/handleToken")

//create router object from express
const router = express.Router();

//routes
router.post('/signUp', authenticateController.signup);
router.post('/login', authenticateController.login);
router.patch('/resetPassword', handleToken, authenticateController.resetPassword);

module.exports = router;