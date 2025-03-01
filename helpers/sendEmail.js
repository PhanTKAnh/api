const nodemailer = require("nodemailer");

module.exports.sendMail = (email, subject,html) =>{

const transporter = nodemailer.createTransport({
service:'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});


async function main() {
  const info = await transporter.sendMail({
    from: process.env.EMAIL_USER, 
    to: email, 
    subject: subject, 
    html: html, 
  });

  console.log("Message sent: %s", info.messageId);

}

main().catch(console.error);
}