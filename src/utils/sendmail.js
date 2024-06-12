import nodemailer from "nodemailer";

const sendEmail = async (to, subject, text)=>{
    const transporter = nodemailer.createTransport({
        host: 'smtp.hostinger.com', // Hostinger SMTP server
        port: 587, // SMTP port
        secure: false, // false for other ports
        auth: {
            user: process.env.EMAIL_USER, // your Hostinger email address
            pass: process.env.EMAIL_PASS // your Hostinger email password
        }
    });

    const mailoptions={
        from:process.env.EMAIL_USER,
        to,
        subject,
        text
    };

    await transporter.sendMail(mailoptions);

};

export default sendEmail;