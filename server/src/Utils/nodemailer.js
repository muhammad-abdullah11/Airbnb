const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.USER_EMAIL, 
    pass: process.env.USER_PASS,  
  },
});

// verify transporter
transporter.verify((error, success) => {
  if (error) {
    console.error(" Gmail connection error:", error);
  } else {
    console.log(" Gmail is ready to send messages");
  }
});

// reusable sendMail function
const sendMail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"My App" <${process.env.USER_EMAIL}>`,
      to,          
      subject,     
      text,        
      html,        
    });

    console.log("Email sent:", info.messageId);
    return info;
  } catch (err) {
    console.error("Error sending email:", err);
    throw err;
  }
};

module.exports = sendMail;
