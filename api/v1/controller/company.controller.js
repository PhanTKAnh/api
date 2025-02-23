const City = require("../model/city.model");
const Company = require("../model/company.model");
const Job = require("../model/job.model");


// [GET] /companies
module.exports.index = async (req, res) => {
    try {
        const companies = await Company.find({
            Status: "active",
            deleted: false
        }).select("_id CompanyName avatar slug")
        res.json(companies);

    } catch (error) {
        res.status(500).json({ code: 500, message: "Lỗi server" });
    }
};
// [GET] /companies/:slugCompany
module.exports.detail = async (req, res) => {
    try {
        const slugPamram = req.params.slugCompany;
        const company = await Company.findOne({
            slug: slugPamram,
            deleted: false,
            Status: "active"
        }).select("-Password -Token");
        res.json(company)
    } catch (error) {
        res.status(500).json({ code: 500, message: "Lỗi server" });
    }
};