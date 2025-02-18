const Company = require("../model/company.model")


// [GET] /companies
module.exports.index = async (req, res) => {
    try {
        const companies = await Company.find({
            Status: "active",
            deleted: false
        }).select("_id CompanyName avatar")
        res.json(companies);

    } catch (error) {
        console.error(error);
        res.status(500).json({ code: 500, message: "Lỗi server" });
    }
};