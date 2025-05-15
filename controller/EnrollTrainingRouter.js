const db = require("../models/dbConnection");

//get about
exports.getEnrollTrainingRouter = async (req, res) => {
  try {
    // Query the database to retrieve all data
    const results = await db.queryPromise("SELECT * FROM enrolltraining");
    res
      .status(200)
      .json({ message: "Data retrieved successfully", data: results });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//add about
exports.createEnrollTrainingRouter = async (req, res) => {
  const { name, email, mobile, gender, dob, course, referBy } = req.body;
  try {
    //data which is add on about table
    const data = {
      name,
      email,
      mobile,
      gender,
      dob,
      course,
      referBy,
      resume:
        req.files.resume === undefined ? "" : req.files.resume[0].filename,
    };

    // Query the database to add the data in table
    const results = await db.queryPromise(
      "INSERT INTO enrolltraining SET ?",
      data
    );

    res.json({
      data: {
        id: results.insertId,
        ...data,
      },
      message: "Your data has been succesfully submitted.",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
