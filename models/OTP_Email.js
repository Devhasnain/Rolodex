import mongoose from "mongoose";
const OtpEmailsSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    otp: {
        type: Number,
        required: true
    },
    expiry: {
        type: Date,
        required: true,
    },
},
    {
        timestamps: true
    }

);

const OTP_Email = mongoose.models.otp_email || mongoose.model("otp_email", OtpEmailsSchema);

export default OTP_Email;