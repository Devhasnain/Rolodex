"use strict"

import Users from "../models/User.js";
import { Errorhandler } from "../utils/Errorhandler.js"
import bcrypt from 'bcrypt';
import JWT from 'jsonwebtoken';
import configurations from '../configurations.js';
import { v4 as UuidV4 } from 'uuid';
import _ from 'lodash';
import Files from "../models/Files.js";
import OTP_Email from "../models/OTP_Email.js";
import transporter from "../utils/nodemailer.js";

let { JWT_SECRET } = configurations;

let supported_files = ['png', 'jpg', 'jpeg', 'svg'];

let user_data_fields = ['name', 'email', 'user_phone', 'user_id', 'flags', '_id', 'user_image',]

export const Registration = async (req, res) => {
    try {
        let user = req.user;

        let hash = await bcrypt.hash(user.password, 12);

        let user_id = UuidV4();

        let NewUser = await Users.create({ ...user, password: hash, user_id, total_adds: 0 });
        await NewUser.save();

        let token = JWT.sign({ _id: NewUser._id, email: NewUser.email }, JWT_SECRET);

        let data = _.pick(NewUser, user_data_fields);

        return res.status(200).json(
            {
                user: data,
                token,
                status: true
            }
        );

    } catch (error) {
        return Errorhandler(error, res);
    }
}

export const Login = async (req, res) => {
    try {
        let { email, password, user_agent } = req.body;
        if (!email || !password) {
            throw new Error("Bad request.")
        }

        let FindUser = await Users.findOne({ email });

        if (!FindUser) {
            throw new Error("Resource not found.")
        }

        let matchPassword = await bcrypt.compare(password, FindUser.password);

        if (!matchPassword) {
            throw new Error("Password not matched.")
        };

        let date = new Date();

        FindUser.last_login = date;
        FindUser.user_agent = user_agent ?? "";

        await FindUser.save();

        let token = JWT.sign({ _id: FindUser._id, email: FindUser.email }, JWT_SECRET);

        let data = _.pick(FindUser, user_data_fields);

        return res.status(200).json(
            {
                user: data,
                token,
                status: true
            }
        );


    } catch (error) {
        return Errorhandler(error, res);
    }
}

export const UpdateProfile = async (req, res) => {
    try {
        let user = req.user;
        let userData = req.body ?? {};
        let profileImage = req?.file;
        let objectLength = Object?.keys(userData)?.length;

        if (objectLength < 1 && !profileImage) {
            throw new Error("Please provide profile data to update the current data.")
        }

        if (profileImage && !supported_files.includes(profileImage?.mimetype?.split("/")[1])) {
            throw new Error(`File type "${profileImage?.mimetype?.split("/")[1]}" is not supported!`)
        }

        let User = await Users.findOne({ _id: user._id });

        if (profileImage) {
            if (User?.image) {
                await Files.findOneAndDelete({ user: user._id });
            }
            let uploadImage = await Files.create({ user: user._id, ...profileImage });
            let saveImage = await uploadImage.save();
            User.image = `${configurations.url}/users/image/${saveImage._id}`;
            await User.save();
        }

        if (objectLength) {
            for (const key in userData) {
                if (key === "password") {
                    let hash = await bcrypt.hash(userData[key], 12);
                    User[key] = hash;
                    await User.save();
                } else {
                    User[key] = userData[key];
                    await User.save();
                }
            }
        }

        return res.status(200).json({ msg: "Profile Updated Successfuly!", status: true });

    } catch (error) {
        return Errorhandler(error, res)
    }
}

export const generateOtpEmail = async (req, res) => {
    try {
        let { email } = req.body

        let user = await Users.findOne({ email });

        if (!user) {
            throw new Error("User not found!");
        };

        const existingCodes = [];
        function generateUniqueRandomCode(existingCodes) {
            let code;
            do {
                code = Math.floor(1000 + Math.random() * 9000);
            } while (existingCodes.includes(code));

            existingCodes.push(code);
            return code;
        }

        let otp = generateUniqueRandomCode(existingCodes);

        let genOtp = await OTP_Email.create({
            user: user._id,
            otp,
            expiry: new Date(Date.now() + 15 * 60 * 1000),
        });

        await genOtp.save();
        transporter.sendMail(
            {
                from: "Rolodex",
                to: email,
                subject: "Password Reset OTP",
                text: `${user?.name ? user?.name : user?.email}, Your OTP for password reset is ${otp}`

            }
        ).catch((error) => {
            throw new Error(error.message);
        })

        return res.status(200).json({ msg: "An otp has been send to your email!", status: true })

    } catch (error) {
        return Errorhandler(error, res);
    }
};

export const verifyOtpEmail = async (req, res) => {
    try {
        let { email, otp } = req.body;

        if (!otp || !email) {
            throw new Error("Bad request.")
        }

        let user = await Users.findOne({ email })

        if (!user) {
            throw new Error("User not found.")
        }

        let otpRecord = await OTP_Email.findOne({ user: user._id, otp });

        if (!otpRecord) {
            throw new Error("Bad request! Unable to authenticate the user.")
        }

        if (otpRecord.expiry < new Date()) {
            await OTP_Email.findOneAndDelete({ _id: otpRecord._id });
            throw new Error("Bad request! Otp has been expired")
        }

        await OTP_Email.findOneAndDelete({ _id: otpRecord._id });

        return res.status(200).json({ msg: "Otp verified successfuly", status: true })

    } catch (error) {
        return Errorhandler(error, res);
    }
};

export const resetPassword = async (req, res) => {
    try {
        let { email, password } = req.body;
        let user = await Users.findOne({ email });
        if (!user) {
            throw new Error("User not found!")
        };
        let hash = await bcrypt.hash(password, 12);
        user.password = hash;
        await user.save();
        return res.status(200).json({ msg: "Password reset successfuly", status: true })
    } catch (error) {
        return Errorhandler(error, res);
    }
};

export const serveImage = async (req, res) => {
    try {
        let { id } = req.params;
        let file = await Files.findOne({ _id: id });
        res.setHeader('Content-Type', 'image/jpeg');
        res.send(file.buffer);
    } catch (error) {
        return Errorhandler(error, res);
    }
}

export const UpdatePassword = async (req, res) => {
    try {
        let user = req.user;
        let { current_password, new_password } = req.body;

        if (!current_password || !new_password) {
            throw new Error("Bad request.")
        }

        let userr = await Users.findOne({ _id: user._id });


        let matchPassword = await bcrypt.compare(current_password, userr.password);

        if (!matchPassword) {
            throw new Error("Password not matched.");
        }

        let hash = await bcrypt.hash(new_password, 12);

        userr.password = hash;

        await userr.save();

        return res.status(200).json({ msg: "Password update successfuly.", status: true });
    } catch (error) {
        return Errorhandler(error, res);
    }
}