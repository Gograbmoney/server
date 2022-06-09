const nodemailer = require("nodemailer")

const sendEmail = async (options) => {

    const transporter = nodemailer.createTransport({
         host: process.env.SMTP_HOST,
         port: process.env.SMTP_PORT,
        //service: "gmail",
        auth: {
            user: process.env.SMTP_EMAIL, // your domain email address
            pass: process.env.SMTP_PASSWORD // your password
        }
    });

    await transporter.sendMail(options, function (err, data) {
        if (err) {
            console.log('Error Occurs');
            console.log(err);
        } else {
            console.log('Email sent successfully');
        }
    });
}

module.exports = sendEmail

