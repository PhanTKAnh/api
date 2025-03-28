const { uploadToCloudinary } = require("../../../helpers/uploadToCloudinary");

const uploadSingle = async (req, res, next) => {
  if (req.file) {
    const link = await uploadToCloudinary(req.file.buffer);
    req.body[req.file.fieldname] = link;
  } 
  next();
};

const uploadFields = async (req, res, next) => {
  if (req.files) {
    for (const key in req.files) {
      const links = [];
      for (const item of req.files[key]) {
        try {
          const link = await uploadToCloudinary(item.buffer);
          links.push(link);
        } catch (error) {
          console.error("Lỗi khi upload file:", error);
        }
      }
      req.body[key] = links;
    }
  }
  next();
};

module.exports = { uploadSingle, uploadFields };
