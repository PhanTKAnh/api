const mongoose = require("mongoose");
const favoriteJobSchema = new mongoose.Schema(
  {
    IdCandidate:String,
    IdJob:String,
    deleted: {
      type: Boolean,
      default: false
  },
    deletedAt: Date,
  },
  {
    timestamps: true,
  }
);
const FavoriteJob = mongoose.model("FavoriteJob", favoriteJobSchema, "favorite-jobs");
module.exports = FavoriteJob;