const db = require("../../models/dbConnection");

//get about
exports.getAbout = async (req, res) => {
  try {
    // Query the database to retrieve all data
    const results = await db.queryPromise("SELECT * FROM homeabout");
    const para = await db.queryPromise(
      "SELECT * FROM homeaboutparagraph WHERE homeaboutId = ?",
      [results[0].id]
    );
    res.status(200).json({
      message: "Data retrieved successfully",
      data: { ...results[0], para: para },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//add about
exports.createAbout = async (req, res) => {
  const {
    heading,
    para,

    project,
    client,
    patner,
    award,
  } = req.body;

  try {
    // Check if an image file was uploaded
    if (!req.files.image) {
      return res.status(400).json({ message: "Please upload a image." });
    }

    if (!req.files.image2) {
      return res.status(400).json({ message: "Please upload a second image." });
    }

    //data which is add on homeabout table
    const data = {
      heading,
      image: req.files.image[0].filename,
      image2: req.files.image2[0].filename,

      project,
      client,
      patner,
      award,
    };

    // Query the database to add the data in table
    const resultsAbout = await db.queryPromise(
      "INSERT INTO homeabout SET ?",
      data
    );

    await JSON.parse(para).forEach(async (item) => {
      //data which is add on homeaboutparagraph table
      const paragraph = { p: item.p, homeaboutId: resultsAbout.insertId };

      // Query the database to add the data in table
      await db.queryPromise("INSERT INTO homeaboutparagraph SET ?", paragraph);
    });
    res.json({
      data: {
        id: resultsAbout.insertId,
        heading,
        image: req.files.image[0].filename,
        image2: req.files.image2[0].filename,
        p: JSON.parse(para),
      },

      project,
      client,
      patner,
      award,
      message: "Your data has been succesfully submitted.",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// edit about
exports.editAbout = async (req, res) => {
  const {
    heading,
    image,
    image2,
    para,
    id,

    project,
    client,
    patner,
    award,
  } = req.body;

  try {
    // Check if the homeId exists in the home table
    const homeResults = await db.queryPromise(
      "SELECT * FROM homeabout WHERE id = ?",
      [id]
    );
    // Check if the home with the given homeId exists
    if (homeResults.length === 0) {
      res.status(400).json({ message: "Data not found" });
      return;
    }

    //get the pargraph data
    const r = await db.queryPromise(
      "SELECT * FROM homeaboutparagraph WHERE homeaboutId = ?",
      [id]
    );

    //store all update para ids which para is already exist
    const ids = [];
    JSON.parse(para).forEach((val) => {
      if (val.id !== undefined) {
        ids.push(val.id.toString());
      }
    });

    // If both id and data are valid, update the home
    const data = {
      heading,
      image: image === undefined ? req.files.image[0].filename : image,
      image2: image2 === undefined ? req.files.image2[0].filename : image2,

      project,
      client,
      patner,
      award,
    };
    await db.queryPromise("UPDATE homeabout SET ? WHERE id = ?", [data, id]);

    let latestPara = [...r, ...JSON.parse(para)];

    //if paragraph is already exist then update otherwise delete and if new para is added add it
    await Promise.all(
      latestPara.map(async (val) => {
        if (val.id === undefined) {
          const addedPara = { p: val.p, homeaboutId: homeResults[0].id };
          await db.queryPromise(
            "INSERT INTO homeaboutparagraph SET ?",
            addedPara
          );
        } else {
          if (ids.includes(val.id.toString())) {
            let pd = null;
            await JSON.parse(para).map(async (v) => {
              if (v.id !== undefined && val.id === v.id) {
                pd = v;
              }
            });
            const updatePara = { p: pd.p };
            await db.queryPromise(
              "UPDATE homeaboutparagraph SET ? WHERE id = ?",
              [updatePara, val.id]
            );
          } else {
            await db.queryPromise(
              "DELETE FROM homeaboutparagraph WHERE id = ?",
              [val.id]
            );
          }
        }
      })
    );

    // Fetch the updated data after all operations are complete
    const resp = await db.queryPromise("SELECT * FROM homeabout WHERE id = ?", [
      id,
    ]);
    const pd = await db.queryPromise(
      "SELECT * FROM homeaboutparagraph WHERE homeaboutId = ?",
      [homeResults[0].id]
    );
    res.status(200).json({
      message: "Data updated successfully",
      data: { ...resp[0], para: pd },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
