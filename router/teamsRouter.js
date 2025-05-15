const express = require("express");
const teamsController = require("../controller/teamsController")
const handleToken = require("../models/handleToken")
const { storage } = require("../models/uploadPhoto");
const multer = require('multer');

const upload = multer({ storage: storage });


const router = express.Router();

router.get('/teams', teamsController.getTeams);

router.patch(
    '/teams',
    upload.fields([{ name: 'image', maxCount: 500 }]),
    handleToken,
    teamsController.editTeams
);

module.exports = router;