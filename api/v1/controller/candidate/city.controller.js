const City = require("../../model/city.model");

// [GET] /cities
module.exports.index =async (req, res) => {
    try {
        const cities = await City.find({
            deleted:false
        });
        res.json(cities);
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ code: 500, message: "Lỗi server" });
    }
    
  };