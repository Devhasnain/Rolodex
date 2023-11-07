"use strict"

import Users from "../models/User.js";
import { Errorhandler, ErrroResponseHandler } from "../utils/Errorhandler.js"
import JWT from 'jsonwebtoken';
import configurations from "../configurations.js";

let { JWT_SECRET } = configurations;

export const CheckExistingEmail = async (req, res, next) => {
    try {
        let { email, password } = req.body;

        if (!email) {
            throw new Error("Registration failed!");
        }

        if (!password) {
            throw new Error("Registration failed! Password is required.");
        }

        let User = await Users.findOne({ email });

        if (User) {
            throw new Error("Registration failed! User already exists with this email:", `${email}.`);
        };

        req.user = req.body;
        next();

    } catch (error) {
        return Errorhandler(error, res);
    }
}

export const ApiGuard = async (req, res, next) => {
    try {
        let token = req.headers.authorization;
        if (!token) {
            throw new Error("Authentication faild .")
        }

        let { _id, email } = JWT.verify(token, JWT_SECRET);

        if (!_id || !email) {
            throw new Error("Authentication faild.")
        }

        let FindUser = await Users.findOne({ _id, email }).select(['-password']);

        if (!FindUser) {
            throw new Error("Authentication faild! User not found.")
        }

        req.user = FindUser;
        next();

    } catch (error) {
        return Errorhandler(error, res);
    }
}

export const checkExistingUserWithEmail = async (req, res, next) => {
    try {
        let user = req.user;
        let { email } = req.body;

        if (!email) {
            next();
            return;
        }

        if (email === user.email) {
            next();
            return;
        }

        let User = await Users.findOne({ email });
        if (User) {
            return res.status(400).json({ msg: "User already exists with this email!", status: false });
        }
        next();
    } catch (error) {
        let resposne = HandleError(error);
        return res.status(resposne.statusCode).json({ resposne, status: false });
    }
}