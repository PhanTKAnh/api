// [POST] /upoad-file
module.exports.uploadFile = (req, res) => {
    if (!req.body.cv) {
      return res.status(500).json({ message: "Upload thất bại" });
    }
  
    return res.status(200).json({
      message: "Upload thành công",
      cvUrl: req.body.cv, // Link CV sau khi upload
    });
  }