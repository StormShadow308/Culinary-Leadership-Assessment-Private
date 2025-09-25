// lib/email.ts

import { MailerSend, EmailParams, Sender, Recipient } from 'mailersend';

// Initialize MailerSend with proper error handling
let mailerSend: MailerSend | null = null;

// Function to initialize MailerSend
function initializeMailerSend() {
  if (mailerSend) return mailerSend;
  
  try {
    if (!process.env.MAILERSEND_API_KEY) {
      throw new Error('MAILERSEND_API_KEY environment variable is not set');
    }
    
    mailerSend = new MailerSend({
      apiKey: process.env.MAILERSEND_API_KEY,
    });
    
    console.log('✅ MailerSend initialized successfully');
    return mailerSend;
  } catch (error) {
    console.error('❌ Failed to initialize MailerSend:', error);
    return null;
  }
}

export interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export async function sendEmail({ to, subject, html, from }: SendEmailParams) {
  // Initialize MailerSend if not already done
  const mailer = initializeMailerSend();
  if (!mailer) {
    throw new Error('MailerSend is not initialized. Please check your MAILERSEND_API_KEY environment variable.');
  }

  // Validate required environment variables
  if (!process.env.EMAIL_FROM) {
    throw new Error('EMAIL_FROM environment variable is not set. Please configure a verified sender email.');
  }

  const fromEmail = from || process.env.EMAIL_FROM;

  try {
    console.log(`📧 Sending email to: ${to}`);
    console.log(`📧 From: ${fromEmail}`);
    console.log(`📧 Subject: ${subject}`);

    const sentFrom = new Sender(fromEmail, "Culinary Leadership Assessment");
    const recipients = [new Recipient(to, to.split('@')[0])]; // Use email prefix as name

    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(recipients)
      .setSubject(subject)
      .setHtml(html);

    const response = await mailer.email.send(emailParams);

    console.log('✅ Email sent successfully via MailerSend');
    return { success: true, data: response };
  } catch (error) {
    console.error('❌ MailerSend email sending error:', error);
    
    // Provide specific error messages for common issues
    if (error instanceof Error) {
      if (error.message.includes('Rate limit')) {
        throw new Error('Email rate limit exceeded. Please try again later.');
      } else if (error.message.includes('Invalid sender')) {
        throw new Error('Sender email not verified. Please verify your sender email in MailerSend.');
      } else if (error.message.includes('Invalid API key')) {
        throw new Error('Invalid MailerSend API key. Please check your configuration.');
      } else if (error.message.includes('Invalid recipient')) {
        throw new Error('Invalid recipient email address.');
      }
    }
    
    throw new Error(`Failed to send email: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
