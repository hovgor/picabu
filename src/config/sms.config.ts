import { Vonage } from '@vonage/server-sdk';
import { Auth } from '@vonage/auth';
import { SMS } from '@vonage/messages/dist/classes/SMS/SMS';
const vonage = new Vonage(
  new Auth({
    apiKey: process.env.SMS_KEY,
    apiSecret: process.env.SMS_SECRET,
  }),
);
const sendSms = (to: any, text: any, from = 'TUTU') => {
  vonage.messages
    .send(new SMS(text, to, from))
    .then((resp: any) => console.log(resp.message_uuid))
    .catch((err: any) => console.error(err));
};
export { sendSms };
