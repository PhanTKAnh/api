const City = require("../model/city.model");
const Company = require("../model/company.model");
const Job = require("../model/job.model");


// [GET] /companies
module.exports.index = async (req, res) => {
    try {
        const companies = await Company.find({
            Status: "active",
            deleted: false
        }).select("_id CompanyName avatar slug").lean();

        const jobs = await Job.find({
            Status:"open",
            deleted:false
        }).lean();
        const cities = await City.find({
            deleted:false
        }).lean();;
        const dataCity = cities.reduce((acc, city) => ({ ...acc, [city._id]: city.CityName }), {});
        const newJobs = jobs.map(({ IdCity, ...job }) => ({
            ...job,
            cities: IdCity.map(cityId => ({
                    id: cityId,
                    CityName: dataCity[cityId]
                })) 
        }));
        
        const newCompany = companies.map(company => (
            {
                ...company,
                jobs: newJobs.filter(job => job.IdCompany === company._id),
                jobCount: newJobs.filter(job => job.IdCompany === company._id).length,
            }
        ))
        
        res.json(newCompany);

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
        }).select("-Password -Token").lean();

        const cities = await City.find({
            deleted:false
        }).lean();
        const dataCity = cities.reduce((acc,city)=>(
           {
             ...acc,
            [city._id] : city.CityName
        }
        ),{});
        const jobs = await Job.find({
            Status:"open",
            deleted:false
        }).lean();
        const newJobs = jobs.map(({ IdCity, ...job }) => ({
            ...job,
            cities: IdCity.map(cityId => ({
                    id: cityId,
                    CityName: dataCity[cityId]
                })) 
        }));
        
        const newCompany = {
                company: company,
                jobs: newJobs.filter(job => job.IdCompany === company._id),
            }
    
        res.json(newCompany)
    } catch (error) {
        res.status(500).json({ code: 500, message: "Lỗi server" });
    }
};