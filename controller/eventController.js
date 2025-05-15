const db = require("../models/dbConnection");

//get event
exports.getEvent = async (req, res) => {
  try {
    // Query the database to retrieve all data
    let results = await db.queryPromise("SELECT * FROM events");
    for (let i = 0; i < results.length; i++) {
      results[i] = {
        ...results[i],
        images: await db.queryPromise(
          "SELECT * FROM eventgallery WHERE event_id  = ?",
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

// add event
exports.addEvent = async (req, res) => {
  let { title, para } = req.body;
  try {
    // Check if an image file was uploaded
    if (!req.files.thumbnail) {
      return res.status(400).json({ message: "Please upload a thumbnail." });
    }

   

    // event insert
    let addevent = {
      title,
      para,
      thumbnail: req.files.thumbnail[0].filename,
      video: req.files.video !== undefined ? req.files.video[0].filename: "",
    };

    const event = await db.queryPromise("INSERT INTO events SET ?", [addevent]);

    //add all image
    await req.files.images.forEach(async (item) => {
      const eventgallery = { image: item.filename, event_id: event.insertId };
      await db.queryPromise("INSERT INTO eventgallery SET ?", eventgallery);
    });

    const results = await db.queryPromise("SELECT * FROM events");
    for (let i = 0; i < results.length; i++) {
      results[i] = {
        ...results[i],
        images: await db.queryPromise(
          "SELECT * FROM eventgallery WHERE event_id  = ?",
          [results[i].id]
        ),
      };
    }

    res.status(200).json({ message: "Data added successfully", data: results });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// edit event
exports.editEvent = async (req, res) => {
  let { title, para, video, thumbnail, images, id } = req.body;
  try {
    // Check if the id exists in the event table
    const event = await db.queryPromise("SELECT * FROM events WHERE id = ?", [
      id,
    ]);

    // Check if the event with the given event_id  exists
    if (event.length === 0) {
      res.status(400).json({ message: "Data not found" });
      return;
    }

    if (req.files.images !== undefined) {
      //delete all existing image
      await db.queryPromise("DELETE FROM eventgallery WHERE event_id = ?", [
        id,
      ]);

      //add all image
      await req.files.images.forEach(async (item) => {
        const eventgallery = { image: item.filename, event_id: id };
        await db.queryPromise("INSERT INTO eventgallery SET ?", eventgallery);
      });
    }

    // If both id and data are valid, update the event
    const data = {
      title,
      para,
      video: video === undefined ? req.files.video[0].filename : video,
      thumbnail:
        thumbnail === undefined ? req.files.thumbnail[0].filename : thumbnail,
    };
    await db.queryPromise("UPDATE events SET ? WHERE id = ?", [data, id]);

    // Fetch the updated data after all operations are complete
    const results = await db.queryPromise("SELECT * FROM events");
    for (let i = 0; i < results.length; i++) {
      results[i] = {
        ...results[i],
        images: await db.queryPromise(
          "SELECT * FROM eventgallery WHERE event_id  = ?",
          [results[i].id]
        ),
      };
    }

    res.status(200).json({ message: "Data updated successfully", data: results });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//delete event
exports.deleteEvent = async (req, res) => {
  let { id } = req.body;
  try {
    // Check if the id exists in the event table
    const event = await db.queryPromise("SELECT * FROM events WHERE id = ?", [
      id,
    ]);

    // Check if the event with the given event_id  exists
    if (event.length === 0) {
      res.status(400).json({ message: "Data not found" });
      return;
    }

    await db.queryPromise("DELETE FROM eventgallery WHERE event_id  = ?", [id]);
    await db.queryPromise("DELETE FROM events WHERE id = ?", [id]);

    const results = await db.queryPromise("SELECT * FROM events");
    for (let i = 0; i < results.length; i++) {
      results[i] = {
        ...results[i],
        images: await db.queryPromise(
          "SELECT * FROM eventgallery WHERE event_id  = ?",
          [results[i].id]
        ),
      };
    }
    res.status(200).json({ message: "Data deleted successfully", data: results });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
