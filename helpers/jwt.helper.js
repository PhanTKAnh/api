const jwt = require("jsonwebtoken");

const ACCESS_SECRET = process.env.JWT_SECRET || "default_access_secret";
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "default_refresh_secret"; // Thêm biến môi trường

// 👉 Tạo Access Token (1 giờ)
const generateToken = (payload, expiresIn = "1h") => {
    return jwt.sign(payload, ACCESS_SECRET, { expiresIn });
};

// 👉 Tạo Refresh Token (30 ngày)
const generateRefreshToken = (payload, expiresIn = "30d") => {
    return jwt.sign(payload, REFRESH_SECRET, { expiresIn });
};

// 👉 Hàm kiểm tra Access Token
const verifyToken = (token) => {
    try {
        return jwt.verify(token, ACCESS_SECRET);
    } catch (error) {
        return null;
    }
};

// 👉 Hàm kiểm tra Refresh Token
const verifyRefreshToken = (token) => {
    try {
        return jwt.verify(token, REFRESH_SECRET);
    } catch (error) {
        return null;
    }
};

module.exports = { generateToken, generateRefreshToken, verifyToken, verifyRefreshToken };
