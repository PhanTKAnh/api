const mongoose = require("mongoose");
const slug = require('mongoose-slug-updater')
mongoose.plugin(slug);
const companySchema = new mongoose.Schema(
  {
    CompanyName: String,
    avatar:String,
    logo:String,
    Email: String,
    Token:String,
    Password: String,
    Address:String,
    WorkingTime: String,
    Website:String,
    QuantityPeople:String,
    Description: String,
    Detail:String,
    slug: { 
      type: String,
      slug: "title",
      unique: true
   },
    Status:{
        type:String,
        default:"initial"
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
const Company  = mongoose.model("Company", companySchema, "company");
module.exports = Company;