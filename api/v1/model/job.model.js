const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");

mongoose.plugin(slug);

const jobSchema = new mongoose.Schema(
  {
    IdCity: {
      type: [String],
      default: []
    },
    IdTags: {
      type: [String], 
      default: []
    },
    IdCompany: {
      type: String,
      default: ""
    },
    Name: {
      type: String,
      required: true
    },
    slug: {
      type: String,
      slug: "Name",
      unique: true
    },
    SalaryMin: {
      type: Number,
      required: true
    },
    SalaryMax: {
      type: Number,
      required: true
    },
    Currency: {
      type: String,
      default: "VND"
    },
    Description: {
      type: String,
      required: true
    },
    Status: {
      type: String,
      default: "open"
    },
    Level: {
      type: String,
      enum: ["Junior", "Mid", "Senior"],
      required: true
    },
    Experience: {
      type: Number,
      required: true
    },
    WorkTime: {
      type: String,
      enum: ["Full-time", "Part-time", "Freelance"],
      required: true
    },
    Education: {
      type: String,
      enum: ["Cao đẳng", "Đại học", "Thạc sĩ", "Tiến sĩ"],
      required: true
    },
    deleted: {
      type: Boolean,
      default: false
    },
    deletedAt: Date
  },
  {
    timestamps: true
  }
);

const Job = mongoose.model("Job", jobSchema, "job");
module.exports = Job;
