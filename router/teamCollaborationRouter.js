const express = require("express");
const teamCollaborationController = require("../controller/teamCollaborationController")
const handleToken = require("../models/handleToken")
const { storage } = require("../models/uploadPhoto");
const multer = require('multer');

const upload = multer({ storage: storage });


const router = express.Router();

router.get('/teamCollaboration', teamCollaborationController.getteamCollaborations);

router.patch(
    '/teamCollaboration',
    upload.fields([{ name: 'image', maxCount: 500 }]),
    handleToken,
    teamCollaborationController.editteamCollaborations
);

module.exports = router;