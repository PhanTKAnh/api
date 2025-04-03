const express = require("express");
const router = express.Router();
const multer = require("multer");
const candidateMidlleware = require("../../middlewares/candidate.middleware")


const controller = require("../../controller/candidate/uploadFile.controller");

const upload = multer();

const uploadCloud = require("../../middlewares/uploadCloud.middlewares");

router.post("/", upload.single("file"), uploadCloud.uploadSingle, controller.uploadFile);
  
  

module.exports = router;
