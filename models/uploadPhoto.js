const multer = require('multer');

// Configure multer for file uploads
exports.storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images/'); // Store uploaded files in the 'images' directory
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + file.originalname.split('.')[0] + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
  }
});
