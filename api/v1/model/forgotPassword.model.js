const mongoose = require("mongoose");

const forgotPasswordSchema = new mongoose.Schema(
    {
        Email: String,
        otp: String,
        expireAt: {
            type: Date, 
            required: true, 
            expires: 0, 
        },
    },
    {
        timestamps: true, 
    }
);

const ForgotPassword = mongoose.model('ForgotPassword', forgotPasswordSchema, "forgot-password");

module.exports = ForgotPassword;
