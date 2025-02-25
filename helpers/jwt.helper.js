const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.JWT_SECRET || "default_secret"; // Lấy từ .env

// 👉 Hàm tạo token
const generateToken = (payload, expiresIn = "1h") => {
    return jwt.sign(payload, SECRET_KEY, { expiresIn });
};

// 👉 Hàm kiểm tra token
const verifyToken = (token) => {
    try {
        return jwt.verify(token, SECRET_KEY);
    } catch (error) {
        return null; // Trả về null nếu token không hợp lệ
    }
};

module.exports = { generateToken, verifyToken };
