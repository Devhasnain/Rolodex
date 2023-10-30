"use strict"

import express from 'express';
import { ApiGuard, CheckExistingEmail } from '../middlewares/auth.js';
import { Login, Registration, UpdatePassword, UpdateProfile, generateOtpEmail, resetPassword, serveImage, verifyOtpEmail } from '../controllers/auth.js';
import { Upload } from '../utils/Multer.js';
var router = express.Router();

/* GET users listing. */
router.post("/register", CheckExistingEmail, Registration);
router.post("/login", Login);
router.post("/update-profile", ApiGuard, Upload.single("image"), UpdateProfile);
router.post("/send-otp-to-email", generateOtpEmail);
router.post("/verify-otp-email", verifyOtpEmail);
router.put("/reset-password", resetPassword);
router.get("/image/:id", serveImage);
router.put("/update-password", ApiGuard, UpdatePassword);
export default router;
