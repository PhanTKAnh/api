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

        const jobs = await Job.find(query);
        res.json(jobs);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
}
