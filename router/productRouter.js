const express = require("express");
const productController = require("../controller/productController")
const handleToken = require("../models/handleToken")
const { storage } = require("../models/uploadPhoto");
const multer = require('multer');

const upload = multer({ storage: storage });

const router = express.Router();

router.get('/products', productController.getProducts);

router.post(
    '/products',
    upload.fields([{ name: 'images', maxCount: 500 }]),
    handleToken,
    productController.addProducts
);

router.patch(
    '/products',
    upload.fields([{ name: 'images', maxCount: 500 }]),
    handleToken,
    productController.editProducts
);

router.delete('/products', productController.deleteProducts);

router.patch('/products/status', productController.statusProducts);

module.exports = router;