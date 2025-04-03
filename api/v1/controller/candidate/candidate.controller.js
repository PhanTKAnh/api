const Candidate = require("../../model/candidate.model");
const jwtHelper = require("../../../../helpers/jwt.helper");
const bcrypt = require('bcrypt');
const saltRounds = 10;
const generateHelper = require("../../../../helpers/generate");
const ForgotPassword = require("../..//model/forgotPassword.model");
const sendMailHelper = require("../../../../helpers/sendEmail");

// [POST] /candidate/register
module.exports.register = async (req, res) => {
    try {
        const Password = await bcrypt.hash(req.body.Password, saltRounds);
        const Email = req.body.Email;
        const existEmail = await Candidate.findOne({ Email: Email, deleted: false });

        if (existEmail) {
            return res.json({ code: 400, message: "Email đã tồn tại" });
        }

        // Tạo user mới
        const candidate = new Candidate({
            FullName: req.body.FullName,
            Email: req.body.Email,
            Password: Password,
        });

        await candidate.save();

        // Tạo token JWT
        const token = jwtHelper.generateToken({
            idCandidate: candidate._id,
            email: candidate.Email,
            name: candidate.Name,
        });
        const refreshToken = jwtHelper.generateRefreshToken({
            idCandidate: candidate._id,
            email: candidate.Email,
        });
        return res.json({
            code: 200,
            message: "Đăng ký thành công",
            tokenCandidate: token,
            refreshToken :refreshToken 
        });
    } catch (error) {
        return res.status(500).json({ code: 500, message: "Lỗi server", error: error.message });
    }
};

// [POST] /candidate/login
module.exports.login = async (req, res) => {
    try {
        const Email = req.body.Email;
        const Password = req.body.Password
        const candidate = await Candidate.findOne({ Email: Email, deleted: false });

        if (!candidate) {
            return res.json({ code: 401, message: "Sai email hoặc mật khẩu!" });
        }

        const isPasswordMatch = await bcrypt.compare(Password, candidate.Password);
        if (!isPasswordMatch) {
            return res.json({ code: 401, message: "Sai email hoặc mật khẩu!" });
        }

        const token = jwtHelper.generateToken({
            idCandidate: candidate._id,
            email: candidate.Email,
            name: candidate.Name,
        });
        const refreshToken = jwtHelper.generateRefreshToken({
            idCandidate: candidate._id,
            email: candidate.Email,
        });

        return res.json({ code: 200, message: "Đăng nhập thành công!", tokenCandidate: token ,refreshTokenCandidate: refreshToken});
    } catch (error) {
        return res.status(500).json({ code: 500, message: "Lỗi server", error: error.message });
    }
};
// [POST] /candidate/reset/refreshToken
module.exports.refreshToken = async (req, res) => {
    try {
        const refreshTokenCandidate = req.body.refreshTokenCandidate;

        if (!refreshTokenCandidate) {
            return res.json({ code: 401, message: "Không có refresh token" });
        }

        const decoded = jwtHelper.verifyRefreshToken(refreshTokenCandidate);

        if (!decoded) {
            return res.json({ code: 403, message: "Refresh token không hợp lệ" });
        }

        // Tạo access token mới
        const newToken = jwtHelper.generateToken({
            idCandidate: decoded.idCandidate,
            email: decoded.email,
        });

        return res.json({
            code: 200,
            message: "Làm mới token thành công!",
            tokenCandidate: newToken,
        });
    } catch (error) {
        return res.json({ code: 500, message: "Lỗi server", error: error.message });
    }
};


// [GET] /candidate/profile
module.exports.profile = async (req, res) => {
    try {
        const candidate = req.candidate;
        return res.json(candidate);
    } catch (error) {
        return res.status(500).json({ code: 500, message: "Lỗi server", error: error.message });
    }
};

// [POST] /candidate/reset/forgotPassword
module.exports.forgotPassword = async (req, res) => {
    try {
        const Email = req.body.email;
        const candidate = await Candidate.findOne({ Email: Email, deleted: false });

        if (!candidate) {
            return res.json({ code: 401, message: "Email không tồn tại" }); // Fix thông báo lỗi
        }

        const timeExpire = 5; // 5 phút
        const otp = generateHelper.generateRandomNumber(6);
        const objectForgotPassword = {
            Email: Email,
            otp: otp,
            expireAt: Date.now() + timeExpire * 60 * 1000,
        };

        const forgotPassword = new ForgotPassword(objectForgotPassword);
        await forgotPassword.save();

        const subject = "Mã OTP xác minh lấy lại mật khẩu";
        const html = `Mã OTP để lấy lại Mật khẩu là <b>${otp}</b>. Thời hạn sử dụng là ${timeExpire} phút.`;

        await sendMailHelper.sendMail(Email, subject, html);

        return res.json({ code: 200, message: "Đã gửi mã qua email thành công" });
    } catch (error) {
        return res.status(500).json({ code: 500, message: "Lỗi server", error: error.message });
    }
};

// [POST] /candidate/reset/otpPassword
module.exports.otpPassword = async (req, res) => {
    try {
        const otp = req.body.otp;

        const result = await ForgotPassword.findOne({
            otp: otp
        });
        if (!result) {
            res.json({
                code: 400,
                message: "OTP không hợp lệ!"
            });
            return;
        };
        const candidate = await Candidate.findOne({
            Email: result.Email
        });
        const token = jwtHelper.generateToken({
            idCandidate: candidate._id,
            email: candidate.Email,
            name: candidate.Name,
        });
        const refreshToken = jwtHelper.generateRefreshToken({
            idCandidate: candidate._id,
            email: candidate.Email,
        });

        res.json({
            code: 200,
            message: "Xác thực thành công",
            tokenCandidate: token ,
            refreshTokenCandidate: refreshToken
        })

    } catch (error) {
        return res.status(500).json({ code: 500, message: "Lỗi server", error: error.message });
    }
}

// [POST] /candidate/reset/resetPassword
module.exports.resetPassword = async (req, res) => {
    try {
        const candidate = req.candidate;
        const newPassword = await bcrypt.hash(req.body.Password, saltRounds);

        candidate.Password = newPassword;
        await candidate.save();
        return res.status(200).json({
            code: 200,
            message: "Đặt lại mật khẩu thành công!"
        });
    } catch (error) {
        return res.status(500).json({ code: 500, message: "Lỗi server", error: error.message });
    }
}
// [POST] /candidate/change-password
module.exports.changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const candidateId = req.candidate?.id; 

        if (!oldPassword || !newPassword) {
            return res.json({ code: 400, message: "Thiếu thông tin mật khẩu" });
        }

        // Kiểm tra xem user có tồn tại không
        const candidate = await Candidate.findById(candidateId);
        if (!candidate) {
            return res.json({ code: 404, message: "Người dùng không tồn tại" });
        }

        // Kiểm tra mật khẩu cũ có chính xác không
        const isMatch = await bcrypt.compare(oldPassword, candidate.Password);
        if (!isMatch) {
            return res.json({ code: 400, message: "Mật khẩu cũ không chính xác" });
        }

        // Mã hóa mật khẩu mới
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        // Cập nhật mật khẩu mới vào database
        candidate.Password = hashedPassword;
        await candidate.save();

        return res.json({ code: 200, message: "Đổi mật khẩu thành công" });
    } catch (error) {
        return res.json({ code: 500, message: "Lỗi server", error: error.message });
    }
};
// [PATCH] /candidate/profile
module.exports.patchProfile = async (req, res) => {
    try {
        const candidateId = req.candidate.id; // Lấy ID ứng viên từ middleware
        const updates = req.body; // Dữ liệu cập nhật gửi từ client

        // Kiểm tra xem ứng viên có tồn tại không
        const candidate = await Candidate.findById(candidateId);
        if (!candidate) {
            return res.status(404).json({ code: 404, message: "Ứng viên không tồn tại" });
        }

        // Cập nhật thông tin ứng viên
        Object.keys(updates).forEach((key) => {
            candidate[key] = updates[key];
        });

        await candidate.save(); // Lưu thay đổi vào database

        return res.status(200).json({
            code: 200,
            message: "Cập nhật thông tin thành công",
            data: candidate,
        });
    } catch (error) {
        return res.status(500).json({ code: 500, message: "Lỗi server", error: error.message });
    }
};