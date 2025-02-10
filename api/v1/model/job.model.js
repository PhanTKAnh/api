const mongoose = require("mongoose");
const jobSchema = new mongoose.Schema(
  {
    IdCompany: String,
    IdCity:Array,
    IdTags: Array,
    Name: String,
    Salary: String,
    Description: String,
    Status: String,
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