const db = require("../models/dbConnection");

//get Teams
exports.getTeams = async (req, res) => {
  try {
    // Query the database to retrieve all data
    const results = await db.queryPromise("SELECT * FROM teams");

    let persons = await db.queryPromise(
      "SELECT * FROM teamsperson WHERE teamsId = ?",
      [results[0].id]
    );
    persons.sort((a, b) => a.numbering - b.numbering);

    for (let i = 0; i < persons.length; i++) {
      persons[i] = {
        ...persons[i],
        directorMsg: persons[i].director
          ? await db.queryPromise(
              "SELECT * FROM teamspersonpara WHERE teamspersonId  = ?",
              [persons[i].id]
            )
          : [],
      };
    }
    let r = [];
    await persons.forEach((v) => {
      if (v.director) {
        r.push(v);
      }
    });
    await persons.forEach((v) => {
      if (!v.director) {
        r.push(v);
      }
    });
    res.status(200).json({
      message: "Data retrieved successfully",
      data: { ...results[0], persons: r },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// edit Teams
exports.editTeams = async (req, res) => {
  let { heading, persons, id } = req.body;
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

    // Check if the personId exists in the person table
    const personResults = await db.queryPromise(
      "SELECT * FROM teams WHERE id = ?",
      [id]
    );
    // Check if the person with the given personId exists
    if (personResults.length === 0) {
      res.status(400).json({ message: "Data not found" });
      return;
    }

    //get the pargraph data
    const r = await db.queryPromise(
      "SELECT * FROM teamsperson WHERE teamsId = ?",
      [id]
    );

    //store all update person ids which person is already exist
    const ids = [];
    persons.forEach((val) => {
      if (val.id !== undefined) {
        ids.push(val.id.toString());
      }
    });

    // If both id and data are valid, update the person
    const data = { heading };
    await db.queryPromise("UPDATE teams SET ? WHERE id = ?", [data, id]);

    let latestSer = [...r, ...persons];
    //if person is already exist then update otherwise delete and if new person is added add it
    await Promise.all(
      latestSer.map(async (val, ind) => {
        if (val.id === undefined) {
          const addedSer = {
            name: val.name,
            image: val.image.filename,
            designation: val.designation,
            linkedInUrl: val.linkedInUrl,
            director: val.director,
            directorMsg: "",
            teamsId: personResults[0].id,
            numbering: val.director ? 0 : val.numbering,
          };
          const tp = await db.queryPromise(
            "INSERT INTO teamsperson SET ?",
            addedSer
          );

          if (val.director) {
            //add all paragraph
            await val.directorMsg.forEach(async (item) => {
              const pac = { para: item.para, teamspersonId: tp.insertId };
              await db.queryPromise("INSERT INTO teamspersonpara SET ?", pac);
            });
          }
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
              linkedInUrl: val.linkedInUrl,
              director: val.director,
              directorMsg: "",
              image:
                typeof val.image === "string" ? val.image : val.image.filename,
              numbering: val.director ? 0 : val.numbering,
            };
            await db.queryPromise("UPDATE teamsperson SET ? WHERE id = ?", [
              updateSer,
              val.id,
            ]);

            //get the service details
            const propa = await db.queryPromise(
              "SELECT * FROM teamspersonpara WHERE teamspersonId  = ?",
              [val.id]
            );
            //store all update propa ids which propa is already exist
            const propaids = [];
            if (val.directorMsg.length > 0) {
              await val.directorMsg.forEach((v) => {
                if (v.id !== undefined) {
                  propaids.push(v.id.toString());
                }
              });

              let latestpropa = [...propa, ...val.directorMsg];
              //if paragraph is already exist then update otherwise delete and if new paragraph is added add it
              await Promise.all(
                latestpropa.map(async (v, ind) => {
                  if (v.id === undefined) {
                    const addedpropa = {
                      para: v.para,
                      teamspersonId: val.id,
                    };
                    await db.queryPromise(
                      "INSERT INTO teamspersonpara SET ?",
                      addedpropa
                    );
                  } else if (propaids.includes(v.id.toString())) {
                    let pd = null;
                    await val.directorMsg.map(async (vv) => {
                      if (vv.id !== undefined && v.id === vv.id) {
                        pd = vv;
                      }
                    });
                    const updatepropa = {
                      para: pd.para,
                    };
                    await db.queryPromise(
                      "UPDATE teamspersonpara SET ? WHERE id = ?",
                      [updatepropa, v.id]
                    );
                  } else {
                    await db.queryPromise(
                      "DELETE FROM teamspersonpara WHERE id = ?",
                      [v.id]
                    );
                  }
                })
              );
            }
          } else {
            await db.queryPromise("DELETE FROM teamsperson WHERE id = ?", [
              val.id,
            ]);
          }
        }
      })
    );

    // Fetch the updated data after all operations are complete
    const resp = await db.queryPromise("SELECT * FROM teams WHERE id = ?", [
      id,
    ]);
    const pd = await db.queryPromise(
      "SELECT * FROM teamsperson WHERE teamsId = ?",
      [personResults[0].id]
    );
    pd.sort((a, b) => a.numbering - b.numbering);

    for (let i = 0; i < pd.length; i++) {
      pd[i] = {
        ...pd[i],
        directorMsg: pd[i].director
          ? await db.queryPromise(
              "SELECT * FROM teamspersonpara WHERE teamspersonId  = ?",
              [pd[i].id]
            )
          : [],
      };
    }
    let rr = [];
    await pd.forEach((v) => {
      if (v.director) {
        rr.push(v);
      }
    });
    await pd.forEach((v) => {
      if (!v.director) {
        rr.push(v);
      }
    });
    res.status(200).json({
      message: "Data updated successfully",
      data: { ...resp[0], persons: rr },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};
