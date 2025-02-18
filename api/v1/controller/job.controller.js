const City = require("../model/city.model");
const Company = require("../model/company.model");
const Job = require("../model/job.model");

module.exports.index = async (req, res) => {
    try {
        // Lấy danh sách công việc (kèm cả thông tin công ty và thành phố)
        const jobs = await Job.find({
            deleted: false,
            Status: "open"
        });

        // Trả về danh sách công việc kèm thông tin công ty và thành phố
        res.json(jobs);

    } catch (error) {
        console.error(error);
        res.status(500).json({ code: 500, message: "Lỗi server" });
    }
};
