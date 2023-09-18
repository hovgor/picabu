import { Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

const transport = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: `${process.env.SEND_EMAIL_ADDRESS}`,
    pass: `${process.env.SEND_EMAIL_PASSWORD}`,
  },
  tls: { rejectUnauthorized: false },
});

const pinMailSender = async (email: string, code: string) => {
  const html = `
            <h1>Type : TUTU</h1>
            <h3>Your Code is : ${code}<h3>
            `;
  return new Promise((resolve, _reject) => {
    const mailOptions = {
      from: `${process.env.SEND_EMAIL_ADDRESS}`,
      to: email,
      subject: 'Verification code from TUTU',
      html,
    };

    transport.sendMail(mailOptions, (error: any, info: any) => {
      if (error) {
        Logger.error(error.rejectedErrors[0]);

        resolve({
          code: 1113,
          message: 'Cannot send email code',
          data: error.rejectedErrors[0],
        });
      }
      console.log(`Email send id: ${info.messageId}`);
      resolve(null);
    });
  });
};

const formMailSender = async (form: any) => {
  return new Promise((resolve, _reject) => {
    form.from = process.env.SEND_EMAIL_ADDRESS.toString();
    transport.sendMail(form, (error: any, info: any) => {
      if (error) {
        Logger.error(error.rejectedErrors[0]);

        resolve({
          code: 1113,
          message: 'Error Sending message form',
          data: error.rejectedErrors[0],
        });
      }
      console.log(`Email send id: ${info.messageId}`);
      resolve({});
    });
  });
};

export { formMailSender, pinMailSender };
