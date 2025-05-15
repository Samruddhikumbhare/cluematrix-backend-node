const db = require("../models/dbConnection");

//get service
exports.getService = async (req, res) => {
  try {
    // Query the database to retrieve all data
    let results = await db.queryPromise("SELECT * FROM services");
    for (let i = 0; i < results.length; i++) {
      results[i] = {
        ...results[i],
        para: await db.queryPromise(
          "SELECT * FROM serviceparagraph WHERE serviceId  = ?",
          [results[i].id]
        ),
      };
    }
    res
      .status(200)
      .json({ message: "Data retrieved successfully", data: results });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// add service
exports.addService = async (req, res) => {
  let { heading, para } = req.body;
  try {
    // Check if an image file was uploaded
    if (!req.files.image) {
      return res.status(400).json({ message: "Please upload a image." });
    }

    // Check if an icon file was uploaded
    if (!req.files.icon) {
      return res.status(400).json({ message: "Please upload a icon." });
    }

    // service insert
    let addservice = {
      heading,
      image: req.files.image[0].filename,
      icon: req.files.icon[0].filename,
    };
    const service = await db.queryPromise("INSERT INTO services SET ?", [
      addservice,
    ]);

    //add all paragraph
    await JSON.parse(para).forEach(async (item) => {
      const pac = { pa: item.pa, serviceId: service.insertId };
      await db.queryPromise("INSERT INTO serviceparagraph SET ?", pac);
    });

    const resp = await db.queryPromise("SELECT * FROM services");
    for (let i = 0; i < resp.length; i++) {
      resp[i] = {
        ...resp[i],
        para: await db.queryPromise(
          "SELECT * FROM serviceparagraph WHERE serviceId  = ?",
          [resp[i].id]
        ),
      };
    }

    res.status(200).json({ message: "Data added successfully", data: resp });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// edit service
exports.editService = async (req, res) => {
  let { heading, image, icon, para, id } = req.body;
  try {
    // Check if the id exists in the service table
    const service = await db.queryPromise(
      "SELECT * FROM services WHERE id = ?",
      [id]
    );

    // Check if the service with the given serviceId  exists
    if (service.length === 0) {
      res.status(400).json({ message: "Data not found" });
      return;
    }

    //get the service details
    const propa = await db.queryPromise(
      "SELECT * FROM serviceparagraph WHERE serviceId  = ?",
      [id]
    );

    //store all update propa ids which propa is already exist
    const propaids = [];
    JSON.parse(para).forEach((val) => {
      if (val.id !== undefined) {
        propaids.push(val.id.toString());
      }
    });

    // If both id and data are valid, update the service
    const data = {
      heading,
      image: image === undefined ? req.files.image[0].filename : image,
      icon: icon === undefined ? req.files.icon[0].filename : icon,
    };
    await db.queryPromise("UPDATE services SET ? WHERE id = ?", [data, id]);

    let latestpropa = [...propa, ...JSON.parse(para)];
    //if paragraph is already exist then update otherwise delete and if new paragraph is added add it
    await Promise.all(
      latestpropa.map(async (val, ind) => {
        if (val.id === undefined) {
          const addedpropa = {
            pa: val.pa,
            serviceId: id,
          };
          await db.queryPromise(
            "INSERT INTO serviceparagraph SET ?",
            addedpropa
          );
        } else {
          if (propaids.includes(val.id.toString())) {
            let pd = null;
            await JSON.parse(para).map(async (v) => {
              if (v.id !== undefined && val.id === v.id) {
                pd = v;
              }
            });
            const updatepropa = {
              pa: pd.pa,
            };
            await db.queryPromise(
              "UPDATE serviceparagraph SET ? WHERE id = ?",
              [updatepropa, val.id]
            );
          } else {
            await db.queryPromise("DELETE FROM serviceparagraph WHERE id = ?", [
              val.id,
            ]);
          }
        }
      })
    );

    // Fetch the updated data after all operations are complete
    const resp = await db.queryPromise("SELECT * FROM services");
    for (let i = 0; i < resp.length; i++) {
      resp[i] = {
        ...resp[i],
        para: await db.queryPromise(
          "SELECT * FROM serviceparagraph WHERE serviceId  = ?",
          [resp[i].id]
        ),
      };
    }

    res.status(200).json({ message: "Data updated successfully", data: resp });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//delete service
exports.deleteService = async (req, res) => {
  let { id } = req.body;
  try {
    // Check if the id exists in the service table
    const service = await db.queryPromise(
      "SELECT * FROM services WHERE id = ?",
      [id]
    );

    // Check if the service with the given serviceId  exists
    if (service.length === 0) {
      res.status(400).json({ message: "Data not found" });
      return;
    }

    await db.queryPromise("DELETE FROM serviceparagraph WHERE serviceId  = ?", [
      id,
    ]);
    await db.queryPromise("DELETE FROM services WHERE id = ?", [id]);

    // Query the database to retrieve all data
    let results = await db.queryPromise("SELECT * FROM services");
    for (let i = 0; i < results.length; i++) {
      results[i] = {
        ...results[i],
        para: await db.queryPromise(
          "SELECT * FROM serviceparagraph WHERE serviceId  = ?",
          [results[i].id]
        ),
      };
    }
    res
      .status(200)
      .json({ message: "Data deleted successfully", data: results });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
