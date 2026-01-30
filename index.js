const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");

require("dotenv").config();
require("./dbConnection/dbConnection");
const router = require("./routes/router");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

const backend = express();
backend.use(express.json());
backend.use(express.urlencoded({ extended: true }));
backend.use(cors());
backend.use("/uploads", express.static("uploads"));
backend.use(router);

const PORT = process.env.PORT || 3000;

backend.listen(PORT, () => {
  console.log(`Server is Running ${PORT}`);
});
