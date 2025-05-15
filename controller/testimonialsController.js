const db = require("../models/dbConnection");

//get Testimonial
exports.getTestimonial = async (req, res) => {
  try {
    // Query the database to retrieve all data
    const results = await db.queryPromise("SELECT * FROM testimonial");

    res.status(200).json({
      message: "Data retrieved successfully",
      data: results,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// edit EditTestimonial
exports.editTestimonial = async (req, res) => {
  let { persons } = req.body;
  try {
    let count = 0;
    // Here, you can process the uploaded images and associate them with persons as needed
    persons = JSON.parse(persons).map((person, ind) => {
      let img = person.image !== "" ? person.image : req.files.image[count];
      if (person.image === "") {
        count = count + 1;
      }
      return {
        ...person,
        image: img, // Use index to associate images with persons
      };
    });

    //get the pargraph data
    const r = await db.queryPromise("SELECT * FROM testimonial");

    //store all update person ids which person is already exist
    const ids = [];
    persons.forEach((val) => {
      if (val.id !== undefined) {
        ids.push(val.id.toString());
      }
    });

    let latestSer = [...r, ...persons];
    //if person is already exist then update otherwise delete and if new person is added add it
    await Promise.all(
      latestSer.map(async (val, ind) => {
        if (val.id === undefined) {
          const addedSer = {
            name: val.name,
            image: val.image.filename,
            designation: val.designation,
            rating: val.rating,
            content: val.content,
          };
          const tp = await db.queryPromise(
            "INSERT INTO testimonial SET ?",
            addedSer
          );
        } else {
          if (ids.includes(val.id.toString())) {
            let pd = null;
            await persons.map(async (v) => {
              if (v.id !== undefined && val.id === v.id) {
                pd = v;
              }
            });
            const updateSer = {
              name: val.name,
              designation: val.designation,
              rating: val.rating,
              content: val.content,
              image:
                typeof val.image === "string" ? val.image : val.image.filename,
            };
            await db.queryPromise("UPDATE testimonial SET ? WHERE id = ?", [
              updateSer,
              val.id,
            ]);
          } else {
            await db.queryPromise(
              "DELETE FROM testimonial WHERE id = ?",
              [val.id]
            );
          }
        }
      })
    );

    // Fetch the updated data after all operations are complete
    const resp = await db.queryPromise("SELECT * FROM testimonial");

    res.status(200).json({
      message: "Data updated successfully",
      data: resp,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};
