const express = require("express");
const router = express.Router();
const candidateMidlleware = require("../../middlewares/candidate.middleware")


const controller = require("../../controller/candidate/candidate.controller");

router.post("/register", controller.register);
router.post("/login", controller.login);
router.get("/profile",candidateMidlleware.requireCandidate, controller.profile);
router.patch("/profile",candidateMidlleware.requireCandidate, controller.patchProfile);
router.post("/reset/forgotPassword",controller.forgotPassword);
router.post("/reset/otpPassword",controller.otpPassword);
router.post("/reset/resetPassword",candidateMidlleware.requireCandidate,controller.resetPassword);
router.post("/refresh-token", controller.refreshToken);
router.patch("/change-password",candidateMidlleware.requireCandidate, controller.changePassword);


module.exports = router;
