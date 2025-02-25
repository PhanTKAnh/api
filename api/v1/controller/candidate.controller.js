const Candidate = require("../model/candidate.model");
const jwtHelper = require("../../../helpers/jwt.helper")

// [POST] /candidate/register
module.exports.register = async (req, res) => {
    const existEmail = await Candidate.findOne({
        Email: req.body.Email,
        deleted: false
    });

    if (existEmail) {
        return res.json({
            code: 400,
            message: "Email đã tồn tại"
        });
    }

    // Tạo user mới
    const candidate = new Candidate({
        FullName: req.body.FullName,
        Email: req.body.Email,
        Password: req.body.Password,
    });

    await candidate.save();

    // Tạo token JWT
    const token = jwtHelper.generateToken({
        email: candidate.Email, 
        name: candidate.Name,
        phone: candidate.Phone,
        address: candidate.Address,
    });

    res.json({
        code: 200,
        message: "Đăng nhập thành công",
        tokenCandidate: token
    });
};
