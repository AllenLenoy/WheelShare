const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
    // 1. Create a transporter
    // For this to work, the user needs to provide a valid EMAIL_USERNAME and EMAIL_PASSWORD in .env
    // If using Gmail, EMAIL_PASSWORD should be an App Password, not the regular account password.
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    // 2. Define the email options
    const mailOptions = {
        from: `WheelShare <${process.env.EMAIL_USERNAME}>`,
        to: options.to,
        subject: options.subject,
        html: options.text, // Using html for better formatting
    };

    // 3. Send the email
    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
