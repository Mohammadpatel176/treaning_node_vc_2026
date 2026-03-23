const transporter = require("../config/mail");

const sendMail = async ({ to, subject, text, attachments = [] }) => {
    try{
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            text,
            attachments
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent: ", info.response);
    }
    catch(err){
        console.log("Email error: ",err.message);
    }
};

module.exports = sendMail; 