const Company = require("../model/company.model");
const FavoriteJob = require("../model/favorite-job.model");
const Job = require("../model/job.model");

// [GET] /favorite
module.exports.index = async (req, res) => {
    const idCandidate = req.candidate.id;

    const favoriteJobs = await FavoriteJob.find({
        IdCandidate: idCandidate, 
        deleted: false
    }).lean();
            const companies = await Company.find({
                deleted: false,
                Status: "active"
            }).select("_id logo CompanyName").lean();

            const dataCompany = companies.reduce((acc, company) => ({
                ...acc,
                [company._id]: {
                    name: company.CompanyName,
                    logo: company.logo
                }
            }), {});
            

            const jobs = await Job.find({
                Status:"open",
                deleted:false
            }).select("_id Name IdCompany").lean();
            const newJobs = jobs.map(({IdCompany, ...job }) => ({
                ...job,
                company: {
                    _id: IdCompany,
                    CompanyName: dataCompany[IdCompany].name,
                    logo: dataCompany[IdCompany].logo
                } 
            }));

            let newFavorite = favoriteJobs.map(({ IdJob, ...favoriteJob }) => ({
                ...favoriteJob,
                jobs: newJobs.filter(job => IdJob.toString() === job._id.toString()),
                
            }));

    res.json(newFavorite);
};
