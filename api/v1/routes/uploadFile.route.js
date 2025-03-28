const express = require("express");
const router = express.Router();
const multer = require("multer");
const candidateMidlleware = require("../middlewares/candidate.middleware")

const upload = multer();

const controller = require("../controller/uploadFile.controller");
const uploadCloud = require("../middlewares/uploadCloud.middlewares");

router.post("/", upload.single("cv"), uploadCloud.uploadSingle, controller.uploadFile);
  
  

module.exports = router;
