const multer = require("multer");
const path = require("path");
const store = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../files"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const filter = (req, file, cb) => {
  if (file.fieldname == "file") {
    if (file.mimetype == "pdf") {
      cb(null, true);
    } else {
      cb(new Error("This doesnt match the required format", false));
    }
  }
};

const upload = multer({
  storage: store,
  fileFilter: filter,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});
module.exports = upload;
