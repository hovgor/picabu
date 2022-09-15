// eslint-disable-next-line @typescript-eslint/no-var-requires
const nodemailer = require('nodemailer');
import * as dotenv from 'dotenv';
dotenv.config();
const transporter = nodemailer.createTransport(
  {
    host: 'smtp.mail.ru',
    port: 465,
    secure: true,

    auth: {
      user: `${process.env.SEND_EMAIL_ADDRESS}`,
      pass: `${process.env.SEND_EMAIL_PASSWORD}`,
    },
  },
  {
    from: `"POSTHUB" <${process.env.SEND_EMAIL_ADDRESS}>`,
  },
);

const mailer = (message) => {
  transporter.sendMail(message, (error, info) => {
    if (error) {
      return { success: false, error };
    }
    console.log(`Email send id: ${info.messageId}`);
  });
  return true;
};

module.exports = mailer;
