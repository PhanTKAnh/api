const Tag = require("../model/tag.model");

// [GET] /tags
module.exports.index =async (req, res) => {
    try {
        const tags = await Tag.find({
            deleted:false
        }).select("_id TagsName");
        res.json(tags);
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ code: 500, message: "Lỗi server" });
    }
    
  }