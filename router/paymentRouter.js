const express = require("express");
const { newPayment, checkStatus, showPayment } = require("../controller/paymentController");

const router = express.Router();

router.post("/payment", newPayment);
router.post("/status/:txnId", checkStatus);

router.get("/showPayment", showPayment);

module.exports = router;
