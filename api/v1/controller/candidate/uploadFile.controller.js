module.exports.uploadFile = (req, res) => {
  const fileUrl = req.body.file; // Lấy link file đã upload từ middleware
  
  if (!fileUrl) {
    return res.status(500).json({ message: "Upload thất bại" });
  }

  return res.status(200).json({
    message: "Upload thành công",
    linkUrl: fileUrl, // Link file sau khi upload
  });
};
