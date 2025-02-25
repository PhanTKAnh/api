const Job = require("../model/job.model");
const Tag = require("../model/tag.model");

// [GET] /tags
module.exports.index = async (req, res) => {
    try {
        const tags = await Tag.find({
            deleted: false
        }).select("_id TagsName");

        const jobs = await Job.find({
            deleted: false,
            Status: "open"
        })
        const countJob = {};
        jobs.forEach((job) => {
            job.IdTags.forEach(tagId => {
                countJob[tagId] = (countJob[tagId] || 0) + 1;
            });
        });
        
        const newTags = tags.map(tag =>({
            _id:tag._id,
            TagsName: tag.TagsName,
            jobCount: countJob[tag._id] || 0
        }))


        res.json(newTags);

    } catch (error) {
        console.error(error);
        res.status(500).json({ code: 500, message: "Lỗi server" });
    }

}