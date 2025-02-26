const jwt = require("jsonwebtoken");
const Candidate = require("../model/candidate.model");

module.exports.requireCandidate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                code: 401,
                message: "Vui lòng gửi kèm theo token hợp lệ"
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const candidate = await Candidate.findOne({
            _id: decoded.idCandidate,
            deleted: false
        }).select("-Password");

        if (!candidate || candidate.deleted) {
            return res.json({
                code: 401,
                message: "Tài khoản không hợp lệ"
            });
        }

        req.candidate = candidate;
        next();
    } catch (error) {
        return res.json({
            code: 401,
            message: "Xác thực thất bại, vui lòng đăng nhập lại"
        });
    }
};
