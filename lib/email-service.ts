import { sendEmail } from './email';

export interface EmailTemplate {
  subject: string;
  html: string;
}

export interface ConfirmationEmailData {
  email: string;
  name: string;
  confirmationUrl: string;
}

export interface PasswordResetEmailData {
  email: string;
  name: string;
  resetUrl: string;
}

export interface WelcomeEmailData {
  email: string;
  name: string;
  role: string;
}

// Email confirmation template
export function getConfirmationEmailTemplate(data: ConfirmationEmailData): EmailTemplate {
  return {
    subject: 'Confirm Your Email - Culinary Leadership Assessment',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Confirmation</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2c3e50; color: white; padding: 20px; text-align: center; }
          .content { padding: 30px; background: #f9f9f9; }
          .button { 
            display: inline-block; 
            background: #3498db; 
            color: white; 
            padding: 12px 30px; 
            text-decoration: none; 
            border-radius: 5px; 
            margin: 20px 0;
          }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Culinary Leadership Assessment</h1>
          </div>
          <div class="content">
            <h2>Welcome, ${data.name}!</h2>
            <p>Thank you for registering with the Culinary Leadership Assessment platform. To complete your registration, please confirm your email address by clicking the button below:</p>
            
            <div style="text-align: center;">
              <a href="${data.confirmationUrl}" class="button">Confirm Email Address</a>
            </div>
            
            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <p style="word-break: break-all; background: #eee; padding: 10px; border-radius: 3px;">
              ${data.confirmationUrl}
            </p>
            
            <p><strong>Important:</strong> This link will expire in 24 hours for security reasons.</p>
            
            <p>If you didn't create an account with us, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>© 2024 Culinary Leadership Assessment. All rights reserved.</p>
            <p>This is an automated message, please do not reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };
}

// Password reset template
export function getPasswordResetEmailTemplate(data: PasswordResetEmailData): EmailTemplate {
  return {
    subject: 'Reset Your Password - Culinary Leadership Assessment',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #e74c3c; color: white; padding: 20px; text-align: center; }
          .content { padding: 30px; background: #f9f9f9; }
          .button { 
            display: inline-block; 
            background: #e74c3c; 
            color: white; 
            padding: 12px 30px; 
            text-decoration: none; 
            border-radius: 5px; 
            margin: 20px 0;
          }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
          .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Password Reset Request</h1>
          </div>
          <div class="content">
            <h2>Hello ${data.name}!</h2>
            <p>We received a request to reset your password for your Culinary Leadership Assessment account.</p>
            
            <div style="text-align: center;">
              <a href="${data.resetUrl}" class="button">Reset Password</a>
            </div>
            
            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <p style="word-break: break-all; background: #eee; padding: 10px; border-radius: 3px;">
              ${data.resetUrl}
            </p>
            
            <div class="warning">
              <strong>Security Notice:</strong> This link will expire in 1 hour for your security. If you didn't request this password reset, please ignore this email and your password will remain unchanged.
            </div>
            
            <p>If you continue to have problems, please contact our support team.</p>
          </div>
          <div class="footer">
            <p>© 2024 Culinary Leadership Assessment. All rights reserved.</p>
            <p>This is an automated message, please do not reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };
}

// Welcome email template
export function getWelcomeEmailTemplate(data: WelcomeEmailData): EmailTemplate {
  const roleDescription = data.role === 'admin' 
    ? 'administrator with full system access'
    : data.role === 'organization' 
    ? 'organization member with dashboard access'
    : 'student with assessment access';

  return {
    subject: 'Welcome to Culinary Leadership Assessment',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #27ae60; color: white; padding: 20px; text-align: center; }
          .content { padding: 30px; background: #f9f9f9; }
          .button { 
            display: inline-block; 
            background: #27ae60; 
            color: white; 
            padding: 12px 30px; 
            text-decoration: none; 
            border-radius: 5px; 
            margin: 20px 0;
          }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to Culinary Leadership Assessment!</h1>
          </div>
          <div class="content">
            <h2>Hello ${data.name}!</h2>
            <p>Your email has been confirmed and your account is now active. You are registered as a <strong>${roleDescription}</strong>.</p>
            
            <p>You can now access your dashboard and start using the platform:</p>
            <ul>
              ${data.role === 'admin' 
                ? '<li>Manage users, organizations, and assessments</li><li>View system analytics and reports</li><li>Configure system settings</li>'
                : data.role === 'organization'
                ? '<li>View assessment results and analytics</li><li>Manage participants and cohorts</li><li>Track student progress</li>'
                : '<li>Take leadership assessments</li><li>View your results and progress</li><li>Access learning resources</li>'
              }
            </ul>
            
            <div style="text-align: center;">
              <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/sign-in" class="button">Sign In to Your Account</a>
            </div>
            
            <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
          </div>
          <div class="footer">
            <p>© 2024 Culinary Leadership Assessment. All rights reserved.</p>
            <p>This is an automated message, please do not reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };
}

// Send confirmation email
export async function sendConfirmationEmail(data: ConfirmationEmailData) {
  const template = getConfirmationEmailTemplate(data);
  return await sendEmail({
    to: data.email,
    subject: template.subject,
    html: template.html
  });
}

// Send password reset email
export async function sendPasswordResetEmail(data: PasswordResetEmailData) {
  const template = getPasswordResetEmailTemplate(data);
  return await sendEmail({
    to: data.email,
    subject: template.subject,
    html: template.html
  });
}

// Send welcome email
export async function sendWelcomeEmail(data: WelcomeEmailData) {
  const template = getWelcomeEmailTemplate(data);
  return await sendEmail({
    to: data.email,
    subject: template.subject,
    html: template.html
  });
}
