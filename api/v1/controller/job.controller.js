const Job = require("../model/job.model");


module.exports.index =async (req, res) => {
    const jobs = await Job.find({
      deleted: false
    });
    res.json(jobs);
  }