require("dotenv").config();
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
const PORT = process.env.PORT || 5000;
const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
};

app.use(express.json());
app.use(cors(corsOptions));

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SENDER_EMAIL,
    pass: process.env.SENDER_APP_PASSWORD,
  },
});

app.post("/send-email", async (req, res) => {
  try {
    const { name, subject, email, message } = req.body;

    if (!name || !subject || !email || !message) {
      return res
        .status(400)
        .json({ status: "error", message: "Missing required fields" });
    }

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: `${name} <${email}>`,
      replyTo: process.env.REPLY_TO,
      subject: subject,
      text: message,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
    res
      .status(200)
      .json({ status: "success", message: "Email sent successfully" });
  } catch (err) {
    console.error("Error sending email:", err);
    res.status(500).json({
      status: "error",
      message: "Error sending email, please try again.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
