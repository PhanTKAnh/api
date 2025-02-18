const JobsRoute = require("./job.route")
const CityRoute = require("./city.route")
const CompanyRoute = require("./company.route")
const TagRoute = require("./tag.route")
const SearchRoute = require("./search.route")
module.exports = (app) =>{
    app.use("/cities", CityRoute)
    app.use("/jobs", JobsRoute)
    app.use("/companies", CompanyRoute)
    app.use("/tags", TagRoute)
    app.use("/search", SearchRoute)
}