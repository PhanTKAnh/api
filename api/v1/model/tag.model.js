const mongoose = require("mongoose");
const tagSchema = new mongoose.Schema(
  {
    TagsName: String,
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
const Tag = mongoose.model("Tag", tagSchema, "tag");
module.exports = Tag;