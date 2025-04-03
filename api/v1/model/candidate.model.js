const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");

mongoose.plugin(slug);

const candidateSchema = new mongoose.Schema(
  {
    FullName:  String,
    Avatar: String,
    Email:  String,
    PhoneNumber: Number,

    BirthDate: {
      type: Date,
      validate: {
        validator: function (value) {
          return value <= new Date();
        },
        message: "Ngày sinh không hợp lệ",
      },
    },
    Gender:  String,
    Password: String,  
    Address:  String,
    Deleted: {
      type: Boolean,
      default: false,
    },
    DeletedAt: {
      type: Date,
      default: null,
    },
    Slug: {
      type: String,
      slug: "FullName",
      unique: true,
    },
    RegisteredAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Candidate = mongoose.model("Candidate", candidateSchema, "candidate");
module.exports = Candidate;
