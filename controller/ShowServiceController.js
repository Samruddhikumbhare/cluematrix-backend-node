const db = require("../models/dbConnection");

//get show service
exports.getShowService = async (req, res) => {
  try {
    // Query the database to retrieve all data
    const results = await db.queryPromise("SELECT * FROM showservice");
    res.status(200).json({
      message: "Data retrieved successfully",
      data: { ...results[0] },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//add show service
exports.createShowService = async (req, res) => {
  const { heading, head2, para } = req.body;

  try {
    // Check if an image file was uploaded
    if (!req.files.image) {
      return res.status(400).json({ message: "Please upload a image." });
    }

    // Check if an image2 file was uploaded
    if (!req.files.image2) {
      return res.status(400).json({ message: "Please upload a image." });
    }

    //data which is add on showservice table
    const data = {
      heading,
      image: req.files.image[0].filename,
      image2: req.files.image2[0].filename,
      head2,
      para,
    };

    // Query the database to add the data in table
    const resultsShowService = await db.queryPromise(
      "INSERT INTO showservice SET ?",
      data
    );

    res.json({
      data: {
        id: resultsShowService.insertId,
        heading,
        image: req.files.image[0].filename,
        image2: req.files.image2[0].filename,
        head2,
        para,
      },
      message: "Your data has been succesfully submitted.",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// edit show service
exports.editShowService = async (req, res) => {
  const { heading, image, image2, head2, para, id } = req.body;

  try {
    // Check if the showserviceId exists in the showservice table
    const showserviceResults = await db.queryPromise(
      "SELECT * FROM showservice WHERE id = ?",
      [id]
    );
    // Check if the showservice with the given showserviceId exists
    if (showserviceResults.length === 0) {
      res.status(400).json({ message: "Data not found" });
      return;
    }

    // If both id and data are valid, update the showservice
    const data = {
      heading,
      image: image === undefined ? req.files.image[0].filename : image,
      image2: image2 === undefined ? req.files.image2[0].filename : image2,
      head2,
      para,
    };
    await db.queryPromise("UPDATE showservice SET ? WHERE id = ?", [data, id]);

    // Fetch the updated data after all operations are complete
    const resp = await db.queryPromise(
      "SELECT * FROM showservice WHERE id = ?",
      [id]
    );
    res
      .status(200)
      .json({ message: "Data updated successfully", data: { ...resp[0] } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
