const express = require("express");
const router = express.Router();
const controller = require("../controller/candidate.controller");
const candidateMidlleware = require("../middlewares/candidate.middleware")

router.post("/register", controller.register);
router.post("/login", controller.login);
router.get("/profie",candidateMidlleware.requireCandidate, controller.profile);
router.post("/reset/forgotPassword",controller.forgotPassword);
router.post("/reset/otpPassword",controller.otpPassword);
router.post("/reset/resetPassword",candidateMidlleware.requireCandidate,controller.resetPassword)

module.exports = router;
