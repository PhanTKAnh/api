const City = require("../model/city.model");
const Company = require("../model/company.model");
const Job = require("../model/job.model");

// [GET] /jobs
module.exports.index = async (req, res) => {
    try {
        const jobs = await Job.find({
            deleted: false,
            Status: "open"
        });

        res.json(jobs);

    } catch (error) {
        console.error(error);
        res.status(500).json({ code: 500, message: "Lỗi server" });
    }
};

// [GET] /jobs/:id
module.exports.getJobs= async (req, res) => {
  try {
    const IdCompany = req.params.id; 
    const listJobs = await Job.find({
        IdCompany:IdCompany,
        Status:"open",
        deleted:false

    });
        res.json(listJobs);
    
  } catch (error) {
    res.status(500).json({ code: 500, message: "Lỗi server" });
  }
       
};
