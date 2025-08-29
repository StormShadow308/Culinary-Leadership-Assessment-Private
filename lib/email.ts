// lib/email.ts

import { MailerSend, EmailParams, Sender, Recipient } from 'mailersend';

const mailerSend = new MailerSend({
  apiKey: process.env.MAILERSEND_API_KEY!,
});

export interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export async function sendEmail({ to, subject, html, from }: SendEmailParams) {
  const defaultFrom = process.env.EMAIL_FROM || 'no-reply@yourdomain.com';

  try {
    const sentFrom = new Sender(defaultFrom, "Culinary Leadership");
    const recipients = [new Recipient(to, "Recipient Name")];

    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(recipients)
      .setSubject(subject)
      .setHtml(html);

    const response = await mailerSend.email.send(emailParams);

    return { success: true, data: response };
  } catch (error) {
    console.error('Email sending error:', error);
    return { success: false, error };
  }
}
