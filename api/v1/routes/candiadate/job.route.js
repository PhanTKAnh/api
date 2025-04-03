const express = require("express");
const router = express.Router();
const candidateMidlleware = require("../../middlewares/candidate.middleware")


const controller = require("../../controller/candidate/job.controller");

router.get("/",candidateMidlleware.checkCandidate, controller.index);
router.get("/detailJob/:slugJob",candidateMidlleware.checkCandidate, controller.detailJob);
router.get("/similarJob/:slugJob",controller.similarJob);
router.patch("/favorite/:typeFavorite/:idJob", candidateMidlleware.requireCandidate, controller.favorite);


module.exports = router;