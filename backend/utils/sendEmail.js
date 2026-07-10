import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  // If the user hasn't set up their Gmail app password yet, we just log it to console
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('\n======================================================');
    console.warn('EMAIL NOT SENT (Missing EMAIL_USER or EMAIL_PASS in .env)');
    console.warn(`To: ${options.email}`);
    console.warn(`Subject: ${options.subject}`);
    console.warn(`Message: ${options.message}`);
    console.warn('======================================================\n');
    return;
  }

  // Create transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Define email options
  const mailOptions = {
    from: `"EcoExplorer Support" <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // Send the email
  await transporter.sendMail(mailOptions);
};

export default sendEmail;
