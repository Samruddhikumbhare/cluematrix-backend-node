const db = require("../models/dbConnection");

//get Blogs
exports.getBlogs = async (req, res) => {
  try {
    // Query the database to retrieve all data
    const results = await db.queryPromise("SELECT * FROM blogs");
    res.status(200).json({
      message: "Data retrieved successfully",
      data: results,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// add Blogs
exports.createBlogs = async (req, res) => {
  const { dataBlogs, id, heading, date } = req.body;

  try {
    // Check if an image file was uploaded
    if (!req.files.frontImg) {
      return res.status(400).json({ message: "Please upload a image." });
    }

    const data = {
      data: dataBlogs,
      frontImg: req.files.frontImg[0].filename,
      heading,
      date,
    };
    await db.queryPromise("INSERT INTO blogs SET ?", data);

    // Fetch the updated data after all operations are complete
    const resp = await db.queryPromise("SELECT * FROM blogs");
    res.status(200).json({ message: "Data created successfully", data: resp });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// edit Blogs
exports.editBlogs = async (req, res) => {
  const { dataBlogs, id, heading, date, frontImg } = req.body;

  try {
    // Check if the blogsId exists in the Blogs table
    const reslt = await db.queryPromise("SELECT * FROM blogs WHERE id = ?", [
      id,
    ]);
    // Check if the Blogs with the given BlogsId exists
    if (reslt.length === 0) {
      res.status(400).json({ message: "Data not found" });
      return;
    }
    // If both id and data are valid, update the Blogs
    const data = {
      data: dataBlogs,
      frontImg:
        frontImg === undefined ? req.files.frontImg[0].filename : frontImg,
      heading,
      date,
    };
    await db.queryPromise("UPDATE blogs SET ? WHERE id = ?", [data, id]);

    // Fetch the updated data after all operations are complete
    const resp = await db.queryPromise("SELECT * FROM blogs");
    res.status(200).json({ message: "Data updated successfully", data: resp });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//delete blogs
exports.deleteBlogs = async (req, res) => {
  let { id } = req.body;
  try {
    // Check if the id exists in the product table
    const product = await db.queryPromise("SELECT * FROM blogs WHERE id = ?", [
      id,
    ]);

    // Check if the product with the given productId exists
    if (product.length === 0) {
      res.status(400).json({ message: "Data not found" });
      return;
    }

    await db.queryPromise("DELETE FROM blogs WHERE id = ?", [id]);
    await db.queryPromise("DELETE FROM blogcomment WHERE blogId = ?", [id]);

    // Query the database to retrieve all data
    let results = await db.queryPromise("SELECT * FROM blogs");

    res
      .status(200)
      .json({ message: "Data deleted successfully", data: results });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//get Blogs Comment
exports.getBlogsComment = async (req, res) => {
  try {
    // Query the database to retrieve all data
    const results = await db.queryPromise(
      "SELECT * FROM blogcomment WHERE blogId = ?",
      [req.params.id]
    );
    res.status(200).json({
      message: "Data retrieved successfully",
      data: results,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// add Blogs Comment
exports.createBlogsComment = async (req, res) => {
  const { name, email, website, comment, blogId } = req.body;

  try {
    const data = {
      name,
      email,
      website,
      comment,
      blogId,
    };
    await db.queryPromise("INSERT INTO blogcomment SET ?", data);

    // Fetch the updated data after all operations are complete
    res.status(200).json({ message: "Data created successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
