const City = require("../model/city.model");
const Company = require("../model/company.model");
const Job = require("../model/job.model");
const Tag = require("../model/tag.model");

// [GET] /jobs
module.exports.index = async (req, res) => {
    try {
        const jobs = await Job.find({
            deleted: false,
            Status: "open"
        }).lean();

        const cities = await City.find({
            deleted:false
        });
        const dataCity = cities.reduce((acc, city) => ({ ...acc, [city._id]: city.CityName }), {});
        const companies = await Company.find({
            Status:"active",
            deleted:false
        })
        const dataCompany = companies.reduce((acc, company) => ({ ...acc, [company._id]: {
            name:company.CompanyName,
            avatar:company.avatar
        } }), {});

        const tags = await Tag.find({
            deleted:false
        });
        const dataTag = tags.reduce((acc,tag) => ({
            ...acc,
            [tag._id]:tag.TagsName
        }),{})


        const newJobs = jobs.map(({IdTags, IdCompany, IdCity, ...job}) =>({
            ...job,
            tag:{
                id: IdTags,
                TagsName: dataTag[IdTags]
            },
            company:{ 
                id: IdCompany, 
                CompanyName: dataCompany[IdCompany]?.name , 
                avatar: dataCompany[IdCompany]?.avatar
            },
            cities: IdCity?.map(cityId => ({ 
                id: cityId,
                CityName: dataCity[cityId]
                 })) || [],
        }))

        res.json(newJobs);

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
