const { convertToSlug } = require("../../../helpers/convertToSlug");
const City = require("../model/city.model");
const Company = require("../model/company.model");
const FavoriteJob = require("../model/favorite-job.model");
const Job = require("../model/job.model");
const Tag = require("../model/tag.model");


// [GET] /jobs
module.exports.index = async (req, res) => {
    try {
        const jobs = await Job.find({
            deleted: false,
            Status: "open"
        }).lean();

        const cities = await City.find({ deleted: false });
        const dataCity = cities.reduce((acc, city) => ({ ...acc, [city._id]: city.CityName }), {});

        const companies = await Company.find({
            Status: "active",
            deleted: false
        });
        const dataCompany = companies.reduce((acc, company) => ({
            ...acc,
            [company._id]: {
                name: company.CompanyName,
                logo: company.logo
            }
        }), {});

        const tags = await Tag.find({ deleted: false });
        const dataTag = tags.reduce((acc, tag) => ({
            ...acc,
            [tag._id]: tag.TagsName
        }), {});

        let newJobs = jobs.map(({ IdTags, IdCompany, IdCity, ...job }) => ({
            ...job,
            tag: {
                id: IdTags,
                TagsName: dataTag[IdTags] || null
            },
            company: {
                id: IdCompany,
                CompanyName: dataCompany[IdCompany]?.name || null,
                logo : dataCompany[IdCompany]?.logo || null
            },
            cities: IdCity?.map(cityId => ({
                id: cityId,
                CityName: dataCity[cityId] || null
            })) || [],
        }));

        // Nếu có ứng viên đăng nhập, kiểm tra xem job nào là yêu thích
        if (req.candidate) {
            const idCandidate = req.candidate.id;

            const favoriteJobs = await FavoriteJob.find({
                IdCandidate: idCandidate
            });
            const favoriteJobIds = new Set(favoriteJobs.map(job => job.IdJob.toString()));

            newJobs = newJobs.map(job => ({
                ...job,
                isFavoriteJob: favoriteJobIds.has(job._id.toString())
            }));
        }

        res.json(newJobs);

    } catch (error) {
        console.error(error);
        res.status(500).json({ code: 500, message: "Lỗi server" });
    }
};

// [GET] /jobs/detailJob/slugJob
module.exports.detailJob = async (req, res) => {
    const slug = req.params.slugJob;

    const detailJob = await Job.findOne({
        slug: slug,
        Status: "open",
        deleted: false
    }).lean();

    const cities = await City.find({
        deleted: false
    }).lean();
    const dataCity = cities.reduce((acc, city) => (
        {
            ...acc,
            [city._id]: city.CityName
        }
    ), {});

    const tags = await Tag.find({
        deleted: false
    });
    const dataTag = tags.reduce((acc, tag) => (
        {
            ...acc,
            [tag._id]: tag.TagsName
        }
    ), {});

    const companies = await Company.find({
        Status:"active",
        deleted:false
    }).select("-Password").lean();;

    const { IdCity, IdTags = [], IdCompany, ...filteredJob } = detailJob;    const newJob = {
        ...filteredJob ,
        company: companies.find(company => IdCompany == company._id),
        cities:  IdCity.map(cityId => ({
            id: cityId,
            CityName: dataCity[cityId]
        })),
        tags:  IdTags.map(tagId => ({
            id: tagId,
            TagsName: dataTag[tagId]
        }))
    }
    if (req.candidate) {
        idCandidate = req.candidate.id;

        const favoriteJob = await FavoriteJob.findOne({
            IdJob: newJob._id,    
            IdCandidate: idCandidate
        });
        newJob.isFavoriteJob = favoriteJob ? true : false;
    }
    res.json(newJob)
}

// [GET] /jobs/similarJob/slugJob
module.exports.similarJob = async (req, res) => {
    try {
        const slugJob = req.params.slugJob;
        
        
        const detailJob = await Job.findOne({
            slug: slugJob,
            Status: "open",
            deleted: false
        }).lean();

        
        if (!detailJob) {
            return res.status(404).json({ message: "Job not found" });
        }

        
        const regexName = new RegExp(detailJob.Name, "i");

      
        const jobs = await Job.find({
            _id: { $ne: detailJob._id },  
            Status: "open",
            deleted: false,
            Name: { $regex: regexName },
            IdCompany: { $ne: detailJob.IdCompany } 

        }).lean();
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

        res.json( newJobs);
    } catch (error) {
        console.error("Error finding similar jobs:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// [PARCH] /jobs/favorite/:typeFavorite/:idJob
module.exports.favorite = async(req,res) =>{
    const  idJob = req.params.idJob;

    const typeFavorite= req.params.typeFavorite;
    const idCandidate = req.candidate.id;

    switch (typeFavorite) {
        case "favorite":
            const existFavoriteJob = await FavoriteJob.findOne({ IdJob: idJob, IdCandidate: idCandidate });

            if (!existFavoriteJob) {
                const record = new FavoriteJob({ IdCandidate: idCandidate, IdJob: idJob });
                await record.save();
            }
            break;

        case "unfavorite":
            await FavoriteJob.deleteOne({ IdJob: idJob, IdCandidate: idCandidate });
            break;

        default:
            return res.status(400).json({ code: 400, message: "Loại yêu thích không hợp lệ" });
    }

    res.json({
        code:200,
        message:"Thành công!"
    })
}