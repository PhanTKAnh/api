const express = require("express");
const router = express.Router();
const candidateMidlleware = require("../../middlewares/candidate.middleware")


const controller = require("../../controller/candidate/search.controller");

router.get("/",candidateMidlleware.checkCandidate, controller.search);

module.exports = router;