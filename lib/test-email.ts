import { sendEmail } from '~/lib/email';

export default async function handler(req, res) {
  const result = await sendEmail({
    to: 'your-email@example.com',
    subject: 'Test MailerSend Email',
    html: '<strong>Hello from MailerSend!</strong>',
  });

  res.status(200).json(result);
}