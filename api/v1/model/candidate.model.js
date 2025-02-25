const mongoose = require("mongoose");
const slug = require('mongoose-slug-updater')
mongoose.plugin(slug);
const candidateSchema = new mongoose.Schema(
  {
    FullName: String,
    avatar:String,
    Email: String,
    PhoneNumber: String,
    BirthDate: Date ,
    Gender:String,
    token:String,
    Password: String,
    Address:String,
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
const Candidate  = mongoose.model("Candidate", candidateSchema, "candidate");
module.exports = Candidate;