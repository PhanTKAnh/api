const express = require("express");
const router = express.Router();
const controller = require("../controller/favorite-jobs.controller");

router.get("/", controller.index);

module.exports = router;