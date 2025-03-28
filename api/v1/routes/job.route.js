const express = require("express");
const router = express.Router();
const controller = require("../controller/job.controller");
const candidateMidlleware = require("../middlewares/candidate.middleware")


router.get("/",candidateMidlleware.checkCandidate, controller.index);
router.get("/detailJob/:slugJob",candidateMidlleware.checkCandidate, controller.detailJob);
router.get("/similarJob/:slugJob",controller.similarJob);
router.patch("/favorite/:typeFavorite/:idJob", candidateMidlleware.requireCandidate, controller.favorite);


module.exports = router;