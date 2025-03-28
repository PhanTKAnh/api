const Applications = require("../model/application.model");
const Company = require("../model/company.model");
const Job = require("../model/job.model");
// [POST]
module.exports.application = async (req, res) => {
    try {
        const idCandidate = req.candidate.id;

        if (!req.body.LinkCV) {
            return res.json({code:400, message: "Thiếu thông tin bắt buộc" });
        }

        const application = new Applications({
            IdCandidate: idCandidate,
            IdCompany: req.body.IdCompany,
            IdJob: req.body.IdJob,
            LinkCV: req.body.LinkCV,
        });

        await application.save();

        res.json({ code:200, message: "Ứng tuyển thành công", application });
    } catch (error) {
        console.error(error);
        res.json({code:500, message: "Lỗi server", error });
    }
};
// [GET]
module.exports.listApplication = async (req, res) => {
    try {
        const idCandidate = req.candidate.id;

        // Lấy danh sách application của candidate
        const applicationJobs = await Applications.find({
            IdCandidate: idCandidate,
            deleted: false
        }).lean();

        // Lấy danh sách công ty
        const companies = await Company.find({
            deleted: false,
            Status: "active"
        }).select("_id logo CompanyName").lean();

        // Chuyển danh sách công ty thành object để tra cứu nhanh
        const dataCompany = companies.reduce((acc, company) => {
            acc[company._id] = {
                name: company.CompanyName,
                logo: company.logo
            };
            return acc;
        }, {});

        // Lấy danh sách công việc
        const jobs = await Job.find({
            Status: "open",
            deleted: false
        }).select("_id Name ").lean();

        // Chuyển đổi danh sách jobs để có thông tin công ty kèm theo
        const jobsMap = jobs.reduce((acc, job) => {
          
                acc[job._id] = {
                    ...job,
                };
            
            return acc;
        }, {});

        // Cập nhật thông tin applicationJobs với job và công ty tương ứng
        const newApplicationJobs = applicationJobs.map(({ IdJob, IdCompany, ...app }) => {
            const jobDetails = jobsMap[IdJob] || null;
            const companyDetails = dataCompany[IdCompany] || null;

            return {
                ...app,
                job: jobDetails,
                company: companyDetails
            };
        });

        res.json(newApplicationJobs);
    } catch (error) {
        console.error("Error fetching applications:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
