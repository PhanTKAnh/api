const express = require("express");
const router = express.Router();
const controller = require("../controller/job.controller");

router.get("/", controller.index);
router.get("/company/:id", controller.getJobs); 

module.exports = router;