const crypto = require("crypto");
const axios = require("axios");
require("dotenv").config();
const db = require("../models/dbConnection");

exports.newPayment = async (req, res) => {
  const { name, mobile, productName, url, amount } = req.body;
  try {
    const merchantTransactionId = "M" + Date.now();

    const data = {
      merchantId: process.env.MERCHANT_ID,
      merchantTransactionId: merchantTransactionId,
      merchantUserId: "MUID" + Date.now(),
      amount: Number(amount) * 100,
      redirectUrl: url,
      redirectMode: "POST",
      paymentInstrument: {
        type: "PAY_PAGE",
      },
    };
    const payload = JSON.stringify(data);
    const payloadMain = Buffer.from(payload).toString("base64");
    const keyIndex = 1;
    const string = payloadMain + "/pg/v1/pay" + process.env.SALT_KEY;
    const sha256 = crypto.createHash("sha256").update(string).digest("hex");
    const checksum = sha256 + "###" + keyIndex;
    const prod_URL = "https://api.phonepe.com/apis/hermes/pg/v1/pay";
    const options = {
      method: "POST",
      url: prod_URL,
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        "X-VERIFY": checksum,
      },
      data: {
        request: payloadMain,
      },
    };

    axios
      .request(options)
      .then(async function (response) {
        //data which is add on about table
        const savedData = {
          name,
          mobile,
          productName,
          merchantTransactionId,
          amount,
        };

        // Query the database to add the data in table
        await db.queryPromise("INSERT INTO payment SET ?", savedData);
        res.status(200).json({
          url: response.data.data.instrumentResponse.redirectInfo.url,
        });
      })
      .catch(function (error) {});
  } catch (error) {
    res.status(500).send({
      message: error.message,
      success: false,
    });
  }
};

exports.checkStatus = async (req, res) => {
  const merchantTransactionId = req.params["txnId"];
  const merchantId = process.env.MERCHANT_ID;
  const keyIndex = 2;
  const string =
    `/pg/v1/status/${merchantId}/${merchantTransactionId}` +
    process.env.SALT_KEY;
  const sha256 = crypto.createHash("sha256").update(string).digest("hex");
  const checksum = sha256 + "###" + keyIndex;
  const options = {
    method: "GET",
    url: `https://api.phonepe.com/apis/hermes/pg/v1/status/${merchantId}/${merchantTransactionId}`,
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
      "X-VERIFY": checksum,
      "X-MERCHANT-ID": `${merchantId}`,
    },
  };
  // CHECK PAYMENT STATUS
  axios
    .request(options)
    .then(async (response) => {
      if (response.data.success === true) {
        return res
          .status(200)
          .send({ success: true, message: "Payment Success" });
      } else {
        return res
          .status(400)
          .send({ success: false, message: "Payment Failure" });
      }
    })
    .catch((err) => {
      res.status(500).send({ msg: err.message });
    });
};

//get Subscribe NewsLetter
exports.showPayment = async (req, res) => {
  try {
    // Query the database to retrieve all data
    const results = await db.queryPromise("SELECT * FROM payment");
    res
      .status(200)
      .json({ message: "Data retrieved successfully", data: results });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
