import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 587,
    auth: {
        // TODO: replace `user` and `pass` values from <https://forwardemail.net>
        user: 'hasnainalam1166@gmail.com',
        pass: 'xwon cogc cnfa wpgz'
    }
});

export default transporter;