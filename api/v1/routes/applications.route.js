const express = require("express");
const router = express.Router();
const multer = require("multer");
const candidateMidlleware = require("../middlewares/candidate.middleware")


const controller = require("../controller/application.controller");
  
  
router.post("/",candidateMidlleware.requireCandidate, controller.application);
router.get("/list",candidateMidlleware.requireCandidate, controller.listApplication);

module.exports = router;
