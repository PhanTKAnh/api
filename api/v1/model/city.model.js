const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
mongoose.plugin(slug);

const citySchema = new mongoose.Schema(
  {
    CityName:String,
    slug: {
      type: String,
      slug: "CityName",  // Dựa vào CityName để tạo slug
      unique: true
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
  },
  {
    timestamps: true,
  }
);

const City = mongoose.model("City", citySchema, "city");
module.exports = City;
