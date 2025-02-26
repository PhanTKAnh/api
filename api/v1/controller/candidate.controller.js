const Candidate = require("../model/candidate.model");
const jwtHelper = require("../../../helpers/jwt.helper");
const bcrypt = require('bcrypt');
const saltRounds = 10;

// [POST] /candidate/register
module.exports.register = async (req, res) => {
    const Password = await bcrypt.hash(req.body.Password, saltRounds);
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
        Password: Password ,
    });

    await candidate.save();

    // Tạo token JWT
    const token = jwtHelper.generateToken({
        idCandidate: candidate._id,
        email: candidate.Email, 
        name: candidate.Name,
        phone: candidate.Phone,
        address: candidate.Address,
    });

    res.json({
        code: 200,
        message: "Đăng ký thành công",
        tokenCandidate: token
    });
};

// [POST] /candidate//login
module.exports.login = async (req,res) =>{
    const Email = req.body.Email;

    const candidate = await Candidate.findOne({
        Email: Email,
        deleted:false
    });
    if(!candidate){
        res.json({
            code: 401,
            message: "Sai email hoặc mật khẩu!",
        }); 
    }

    const Password =  await bcrypt.compare(req.body.Password, candidate.Password);
    if(!Password){
        res.json({
            code: 401,
            message: "Sai email hoặc mật khẩu!",
        }); 
    }

    const token = jwtHelper.generateToken({
        idCandidate: candidate._id,
        email: candidate.Email, 
        name: candidate.Name,
        phone: candidate.Phone,
        address: candidate.Address,
    });
    res.json({
        code:200,
        message:"Đăng nhập thành công!",
        tokenCandidate:token
    })
}
// [GET] /candidate/profie
module.exports.profie = async (req, res) =>{
    const candidate = req.candidate;
    console.log(candidate);
    res.json(candidate)
}