const nodemailer = require("nodemailer")

const sendEmail = async (options) => {

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
            user: process.env.SMTP_EMAIL, // your domain email address
            pass: process.env.SMTP_PASSWORD // your password
        }
    });
    await transporter.sendMail(options);
}

module.exports = sendEmail

