const jwt = require("jsonwebtoken");
const Candidate = require("../model/candidate.model");
const jwtHelper = require(("../../../helpers/jwt.helper"))

module.exports.requireCandidate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.json({
                code: 401,
                message: "Vui lòng gửi kèm theo token hợp lệ",
            });
        }

        const token = authHeader.split(" ")[1];

        // Kiểm tra token hợp lệ hay không
        const decoded = jwtHelper.verifyToken(token); // Dùng hàm verifyToken đã tạo
        if (!decoded) {
            return res.json({
                code: 401,
                message: "Token không hợp lệ hoặc đã hết hạn",
            });
        }

        const candidate = await Candidate.findOne({
            _id: decoded.idCandidate,
            deleted: false,
        }).select("-Password");

        if (!candidate) {
            return res.json({
                code: 401,
                message: "Tài khoản không hợp lệ hoặc đã bị xóa",
            });
        }

        req.candidate = candidate;
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.json({
                code: 403,
                message: "Token đã hết hạn, vui lòng làm mới bằng refresh token",
            });
        } else if (error.name === "JsonWebTokenError") {
            return res.json({
                code: 403,
                message: "Token không hợp lệ",
            });
        }

        return res.json({
            code: 500,
            message: "Lỗi xác thực, vui lòng thử lại",
            error: error.message,
        });
    }
};

module.exports.checkCandidate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return next(); // Không có token thì tiếp tục mà không báo lỗi
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwtHelper.verifyToken(token);
        
        if (!decoded) {
            return next(); // Token không hợp lệ thì vẫn cho đi tiếp
        }

        const candidate = await Candidate.findOne({
            _id: decoded.idCandidate,
            deleted: false,
        }).select("-Password");

        if (candidate) {
            req.candidate = candidate; // Nếu có ứng viên thì gán vào req
        }

    } catch (error) {
        console.error("Lỗi khi kiểm tra token:", error);
    }
    
    next(); // Luôn gọi next() để tiếp tục
};