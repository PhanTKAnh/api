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
