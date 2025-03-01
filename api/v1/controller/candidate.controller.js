const Candidate = require("../model/candidate.model");
const jwtHelper = require("../../../helpers/jwt.helper");
const bcrypt = require('bcrypt');
const saltRounds = 10;
const generateHelper = require("../../../helpers/generate");
const ForgotPassword = require("../model/forgotPassword.model");
const sendMailHelper = require("../../../helpers/sendEmail");

// [POST] /candidate/register
module.exports.register = async (req, res) => {
    try {
        const Password = await bcrypt.hash(req.body.Password, saltRounds);
        const existEmail = await Candidate.findOne({ Email: req.body.Email, deleted: false });

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

        return res.json({ code: 200, message: "Đăng ký thành công", tokenCandidate: token });
    } catch (error) {
        return res.status(500).json({ code: 500, message: "Lỗi server", error: error.message });
    }
};

// [POST] /candidate/login
module.exports.login = async (req, res) => {
    try {
        const Email = req.body.Email;
        const candidate = await Candidate.findOne({ Email: Email, deleted: false });

        if (!candidate) {
            return res.json({ code: 401, message: "Sai email hoặc mật khẩu!" });
        }

        const isPasswordMatch = await bcrypt.compare(req.body.Password, candidate.Password);
        if (!isPasswordMatch) {
            return res.json({ code: 401, message: "Sai email hoặc mật khẩu!" });
        }

        const token = jwtHelper.generateToken({
            idCandidate: candidate._id,
            email: candidate.Email,
            name: candidate.Name,
        });

        return res.json({ code: 200, message: "Đăng nhập thành công!", tokenCandidate: token });
    } catch (error) {
        return res.status(500).json({ code: 500, message: "Lỗi server", error: error.message });
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


        res.json({
            code: 200,
            message: "Xác thực thành công",
            tokenCandidate: token
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