const mongoose = require("mongoose");
const slug = require('mongoose-slug-updater')
mongoose.plugin(slug);
const applicationsSchema = new mongoose.Schema(
  {
    IdCompany:String,
    IdCandidate:String,
    IdJob:String,
    IdCity:String,
    LinkCV:{
      type: String,
    },
    StatusRead:{
        type: String,
        default: "unRead"
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
const Applications  = mongoose.model("Applications", applicationsSchema, "applications");
module.exports = Applications;