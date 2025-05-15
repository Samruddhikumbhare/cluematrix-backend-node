const express = require("express");
const blogsController = require("../controller/blogsController");
const handleToken = require("../models/handleToken");
const { storage } = require("../models/uploadPhoto");
const multer = require("multer");

const upload = multer({ storage: storage });
const router = express.Router();

router.get("/blogs", blogsController.getBlogs);

router.patch(
  "/blogs",
  upload.fields([{ name: "frontImg", maxCount: 1 }]),
  handleToken,
  blogsController.editBlogs
);

router.post(
  "/blogs",
  upload.fields([{ name: "frontImg", maxCount: 1 }]),
  handleToken,
  blogsController.createBlogs
);
router.delete('/blogs', blogsController.deleteBlogs);


router.get("/blogComment/:id", blogsController.getBlogsComment);
router.post("/blogComment", blogsController.createBlogsComment);

module.exports = router;
