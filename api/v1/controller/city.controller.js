const City = require("../model/ciity.model")

// [GET] /cities
module.exports.index =async (req, res) => {
    const cities = await City.find({
        deleted:false
    });
    res.json(cities)
  }