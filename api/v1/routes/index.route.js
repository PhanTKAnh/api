const JobsRoute = require("./job.route")
const CityRoute = require("./city.route")
module.exports = (app) =>{
    app.use("/cities", CityRoute)
    app.use("/jobs", JobsRoute)
}