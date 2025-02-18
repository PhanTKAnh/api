const City = require("../model/city.model");
const Job = require("../model/job.model");

//[GET] / search
module.exports.search = async (req, res) =>{
    try {
        const keyword = req.query.keyword;
        const cityParam = req.query.city ? req.query.city.split(",") : [];
        const tagParam= req.query.tag;
        const tagId = req.query.id;
        console.log(tagId);
    

    let query = {
        Status: "open",
        deleted: false,
    };

    if(keyword){
        const keywordRegex = RegExp(keyword,"i");
        query.Name = keywordRegex
    };

    if(cityParam.length > 0){
        const cityRegex = cityParam.map(item => new RegExp(`^${item.trim()}$`,"i"))
        const cities = await City.find({
            CityName:{$in: cityRegex},
            deleted:false,
        });
        const IdsCity = cities.map(city => city._id.toString()); 
        if(IdsCity.length > 0){
            query.IdCity = {$in: IdsCity};
        }
    }
    if(tagParam){
        
    }

    const jobs = await Job.find(query)
    res.json(jobs)
        
    } catch (error) {
        console.error(error);
    return res.status(500).json({ error: error.message });
    }
}