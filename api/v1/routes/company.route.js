const express = require("express");
const router = express.Router();
const controller = require("../controller/company.controller");

router.get("/", controller.index);
router.get("/:slugCompany", controller.detail);

module.exports = router;