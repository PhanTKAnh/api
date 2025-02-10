const express = require("express");
const router = express.Router();
const controller = require("../controller/job.controller");

router.get("/", controller.index);

module.exports = router;