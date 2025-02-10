const mongoose = require("mongoose");
const citySchema = new mongoose.Schema(
  {
    cityName: String,
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