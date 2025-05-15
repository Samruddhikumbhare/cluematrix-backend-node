const express = require("express");
const clientController = require("../controller/clientController")
const handleToken = require("../models/handleToken")
const { storage } = require("../models/uploadPhoto");
const multer = require('multer');

const upload = multer({ storage: storage });


const router = express.Router();

router.get('/clients', clientController.getClients);

router.patch(
    '/clients',
    upload.fields([{ name: 'image', maxCount: 500 }]),
    handleToken,
    clientController.editClients
);

module.exports = router;