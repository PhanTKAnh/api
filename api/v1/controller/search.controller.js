const City = require("../model/city.model");
const Company = require("../model/company.model");
const Job = require("../model/job.model");
const Tag = require("../model/tag.model");


//[GET] / search
module.exports.search = async (req, res) => {
    try {
        const keyword = req.query.keyword;
        const cityParam = req.query.city ? req.query.city.split(",") : [];
        const tagParam = req.query.tag ? req.query.tag.split(",") : [];
        const levelParam = req.query.level;
        const experienceParam = req.query.experience;
        const salaryParam = req.query.salary;
        const educationParam = req.query.education;
        const workTimeParam = req.query.jobType;

        let query = {
            Status: "open",
            deleted: false,
        };

        if (keyword) {
            const keywordRegex = new RegExp(keyword, "i");
            query.Name = keywordRegex;
        }

        if (cityParam.length > 0) {
            const cityRegex = cityParam.map(item => new RegExp(item, "i"));
            const cities = await City.find({
                slug: { $in: cityRegex },
                deleted: false,
            });

            const IdsCity = cities.map(city => city._id.toString());
            if (IdsCity.length > 0) {
                query.IdCity = { $in: IdsCity };
            }
        }

        if (tagParam.length > 0) {
            const tagRegex = tagParam.map(item => new RegExp(item, "i"));
            const tags = await Tag.find({
                TagsName: { $in: tagRegex },
                deleted: false,
            });

            const IdsTag = tags.map(tag => tag._id.toString());
            if (IdsTag.length > 0) {
                query.IdTags = { $in: IdsTag };
            }
        }

        if (levelParam) {
            const levelRegex = new RegExp(levelParam, "i");
            query.Level = levelRegex;
        }
        if (experienceParam) {
            let minExp = 0, maxExp = Infinity;
        
            // Chuẩn hóa experienceParam để so sánh chính xác
            const normalizedExperience = decodeURIComponent(experienceParam).replace(/\+/g, " ");
        
            switch (normalizedExperience) {
                case "Dưới 1 năm":
                    maxExp = 12;
                    break;
        
                case "1-2 năm":
                    minExp = 12;
                    maxExp = 24;
                    break;
        
                case "3-5 năm":
                    minExp = 36;
                    maxExp = 60;
                    break;
        
                case "Trên 5 năm":
                    minExp = 60;
                    break;
        
                default:
                    console.log("Không có dữ liệu phù hợp");
                    return [];
            }
        
            query.Experience = { $gte: minExp, $lt: maxExp };
        }
        if (salaryParam) {
            let minSalary = 0, maxSalary = Infinity;
                    // Chuẩn hóa experienceParam để so sánh chính xác
                    const normalizedSalary = decodeURIComponent(salaryParam).replace(/\+/g, " ");
            switch (normalizedSalary) {
                case "Dưới 10 triệu":
                    maxSalary = 10000000;
                    break;
        
                case "10-20 triệu":
                    minSalary = 10000000;
                    maxSalary = 20000000;
                    break;
        
                case "20-50 triệu":
                    minSalary = 20000000;
                    maxSalary = 50000000;
                    break;
        
                case "Trên 50 triệu":
                    minSalary = 50000000;
                    break;
        
                default:
                    console.log("Không có dữ liệu phù hợp");
                    return [];
            }
        
            query.$or = [
                { SalaryMin: { $gte: minSalary, $lte: maxSalary } },
                { SalaryMax: { $gte: minSalary, $lte: maxSalary } }
            ];
        }
        if (educationParam) {
            const educationRegex = new RegExp(educationParam, "i");
            query.Education = educationRegex;
        }
        if (workTimeParam) {
            const workTimeRegex = new RegExp(workTimeParam, "i");
            query.WorkTime = workTimeRegex;
        }
        
        

        const jobs = await Job.find(query).lean();

        const cities = await City.find({
            deleted: false
        });
        const dataCity = cities.reduce((acc, city) => ({ ...acc, [city._id]: city.CityName }), {});

        const companies = await Company.find({
            Status: "active",
            deleted: false
        })
        const dataCompany = companies.reduce((acc, company) => ({
            ...acc, [company._id]: {
                name: company.CompanyName,
                logo: company.logo
            }
        }), {});

        const tags = await Tag.find({
            deleted: false
        });
        const dataTag = tags.reduce((acc, tag) => ({
            ...acc,
            [tag._id]: tag.TagsName
        }), {})


        const newJobs = jobs.map(({ IdTags, IdCompany, IdCity, ...job }) => ({
            ...job,
            tag: IdTags.map(tagId => ({
                id: tagId,
                TagsName: dataTag[tagId]
            })),
            company: {
                id: IdCompany,
                CompanyName: dataCompany[IdCompany]?.name,
                avatar: dataCompany[IdCompany]?.avatar
            },
            cities: IdCity?.map(cityId => ({
                id: cityId,
                CityName: dataCity[cityId]
            })),
        }))
        res.json(newJobs);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
}
