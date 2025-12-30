const nodemailer = require("nodemailer");
const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SANDBOXHOST,
    port: process.env.EMAIL_SANDBOXPORT,
    auth: {
      user: process.env.EMAIL_SANDBOXUSER,
      pass: process.env.EMAIL_SANDBOXPASS,
    },
  });
  //
  //
  const mailOptions = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: options.receiver,
    subject: options.subject,
    text: options.text,
    html: options.message,
  };
  await transporter.sendMail(mailOptions);
};
module.exports = sendEmail;
