const mongoose = require("mongoose");
const slug = require('mongoose-slug-updater')
mongoose.plugin(slug);
const jobSchema = new mongoose.Schema(
  {
    IdCity: Array,
    IdTags: Array,
    IdCompany: {
      type: String,
      default: ""
    },
    Name: String,
    slug: { 
      type: String,
      slug: "Name",
      unique: true
   },
    Salary: String,
    Description: String,
    Status: String,
    Level: String,
    Experience: String,
    WorkTime: String,
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
const Job = mongoose.model("Job", jobSchema, "job");
module.exports = Job;