const db = require("../models/dbConnection");

//get Schedule Service
exports.getScheduleservice = async (req, res) => {
  try {
    // Query the database to retrieve all data
    const results = await db.queryPromise("SELECT * FROM scheduleservice");
    for (let i = 0; i < results.length; i++) {
      results[i] = {
        ...results[i],
        service: await db.queryPromise("SELECT * FROM services WHERE id  = ?", [
          results[i].serviceId,
        ]),
      };
    }
    res
      .status(200)
      .json({ message: "Data retrieved successfully", data: results });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//add Schedule Service
exports.createScheduleservice = async (req, res) => {
  const { name, email, mobile, idea, serviceId } = req.body;

  try {
    //data which is add on scheduleservice table
    const data = {
      name,
      email,
      mobile,
      idea,
      document:
        req.files.document !== undefined ? req.files.document[0].filename : "",
      serviceId,
    };

    // Query the database to add the data in table
    await db.queryPromise("INSERT INTO scheduleservice SET ?", data);

    const resultsres = await db.queryPromise("SELECT * FROM scheduleservice");
    for (let i = 0; i < resultsres.length; i++) {
      resultsres[i] = {
        ...resultsres[i],
        service: await db.queryPromise("SELECT * FROM services WHERE id  = ?", [
          resultsres[i].serviceId,
        ]),
      };
    }

    res.json({
      data: resultsres,
      message: "Your data has been submitted succesfully.",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//delete Schedule Service
exports.deleteScheduleservice = async (req, res) => {
  let { ids } = req.body;
  try {
    // Use Promise.all to wait for all deletions to complete
    await Promise.all(
      ids.map(async (val) => {
        await db.queryPromise("DELETE FROM scheduleservice WHERE id = ?", [
          val,
        ]);
      })
    );

    const results = await db.queryPromise("SELECT * FROM scheduleservice");
    for (let i = 0; i < results.length; i++) {
      results[i] = {
        ...results[i],
        service: await db.queryPromise("SELECT * FROM services WHERE id  = ?", [
          results[i].serviceId,
        ]),
      };
    }
    res
      .status(200)
      .json({ message: "Data deleted successfully", data: results });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
