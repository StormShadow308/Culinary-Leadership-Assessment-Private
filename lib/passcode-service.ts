import { db } from '~/db';
import { passcodes } from '~/db/schema';
import { eq, and, sql } from 'drizzle-orm';
import { sendEmail } from './email';

export interface PasscodeData {
  email: string;
  type: 'registration' | 'password_reset';
}

export interface PasscodeTemplate {
  subject: string;
  html: string;
}

// Generate a 6-digit passcode
function generatePasscode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Get passcode email template
function getPasscodeEmailTemplate(data: PasscodeData, code: string): PasscodeTemplate {
  const isRegistration = data.type === 'registration';
  
  return {
    subject: isRegistration 
      ? 'Verify Your Email - Culinary Leadership Assessment'
      : 'Password Reset Code - Culinary Leadership Assessment',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${isRegistration ? 'Email Verification' : 'Password Reset'}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2c3e50; color: white; padding: 20px; text-align: center; }
          .content { padding: 30px; background: #f9f9f9; }
          .code { 
            background: #3498db; 
            color: white; 
            padding: 20px; 
            text-align: center; 
            font-size: 32px; 
            font-weight: bold; 
            letter-spacing: 5px; 
            border-radius: 8px; 
            margin: 20px 0;
            font-family: 'Courier New', monospace;
          }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
          .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Culinary Leadership Assessment</h1>
          </div>
          <div class="content">
            <h2>${isRegistration ? 'Verify Your Email Address' : 'Reset Your Password'}</h2>
            <p>${isRegistration 
              ? 'Thank you for registering! To complete your registration, please use the verification code below:'
              : 'You requested to reset your password. Use the code below to verify your identity:'
            }</p>
            
            <div class="code">${code}</div>
            
            <div class="warning">
              <strong>Security Notice:</strong> This code will expire in 10 minutes for your security. 
              ${isRegistration 
                ? 'If you didn\'t create an account with us, please ignore this email.'
                : 'If you didn\'t request a password reset, please ignore this email and your password will remain unchanged.'
              }
            </div>
            
            <p><strong>Important:</strong> Never share this code with anyone. Our team will never ask for your verification code.</p>
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

// Generate and send passcode
export async function generateAndSendPasscode(data: PasscodeData): Promise<{ success: boolean; code?: string; error?: string }> {
  try {
    console.log(`🔄 Generating passcode for ${data.email} (${data.type})`);
    
    // Generate 6-digit passcode
    const code = generatePasscode();
    console.log(`🔑 Generated passcode: ${code}`);
    
    // Set expiration time (10 minutes from now)
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    console.log(`⏰ Passcode expires at: ${expiresAt.toISOString()}`);
    
    // Clean up any existing passcodes for this email and type
    console.log('🧹 Cleaning up existing passcodes...');
    await db.delete(passcodes).where(
      and(
        eq(passcodes.email, data.email),
        eq(passcodes.type, data.type)
      )
    );
    
    // Store passcode in database
    console.log('💾 Storing passcode in database...');
    await db.insert(passcodes).values({
      email: data.email,
      code: code,
      type: data.type,
      expiresAt: expiresAt
    });
    console.log('✅ Passcode stored in database');
    
    // Get email template
    console.log('📧 Generating email template...');
    const template = getPasscodeEmailTemplate(data, code);
    console.log('✅ Email template generated');
    
    // Send email
    console.log('📤 Sending email...');
    try {
      const emailResult = await sendEmail({
        to: data.email,
        subject: template.subject,
        html: template.html
      });
      
      if (!emailResult.success) {
        throw new Error('Failed to send email');
      }
      console.log('✅ Email sent successfully');
    } catch (emailError) {
      console.error('❌ Email sending failed:', emailError);
      
      // Provide specific error messages based on the error type
      if (emailError instanceof Error) {
        if (emailError.message.includes('Rate limit')) {
          throw new Error('Email rate limit exceeded. Please try again in a few minutes.');
        } else if (emailError.message.includes('Sender email not verified')) {
          throw new Error('Email service configuration error. Please contact support.');
        } else if (emailError.message.includes('Invalid API key')) {
          throw new Error('Email service configuration error. Please contact support.');
        } else if (emailError.message.includes('Invalid recipient')) {
          throw new Error('Invalid email address. Please check your email and try again.');
        } else {
          throw new Error(`Failed to send verification code: ${emailError.message}`);
        }
      } else {
        throw new Error('Failed to send verification code. Please try again.');
      }
    }
    
    console.log(`✅ Passcode sent to ${data.email} for ${data.type}`);
    return { success: true, code: code };
    
  } catch (error) {
    console.error('❌ Failed to generate and send passcode:', error);
    console.error('❌ Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined
    });
    
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

// Verify passcode
export async function verifyPasscode(email: string, code: string, type: 'registration' | 'password_reset'): Promise<{ success: boolean; error?: string }> {
  try {
    console.log(`🔍 Verifying passcode for ${email} (${type})`);
    
    // First, find passcode without expiration check
    const passcodeRecord = await db
      .select()
      .from(passcodes)
      .where(
        and(
          eq(passcodes.email, email),
          eq(passcodes.code, code),
          eq(passcodes.type, type)
        )
      )
      .limit(1);
    
    if (passcodeRecord.length === 0) {
      console.log('❌ No passcode found for this email/code/type combination');
      return { 
        success: false, 
        error: 'Invalid passcode. Please check your code and try again.' 
      };
    }
    
    const passcode = passcodeRecord[0];
    console.log(`📧 Found passcode for ${passcode.email}`);
    console.log(`⏰ Expires at: ${passcode.expiresAt}`);
    console.log(`✅ Used: ${passcode.used}`);
    
    // Check if already used
    if (passcode.used) {
      console.log('❌ Passcode has already been used');
      return { 
        success: false, 
        error: 'This passcode has already been used. Please request a new one.' 
      };
    }
    
    // Check expiration manually to avoid timezone issues
    const now = new Date();
    const expiresAt = new Date(passcode.expiresAt);
    
    console.log(`⏰ Current time: ${now.toISOString()}`);
    console.log(`⏰ Expires at: ${expiresAt.toISOString()}`);
    
    if (now > expiresAt) {
      console.log('❌ Passcode has expired');
      return { 
        success: false, 
        error: 'Passcode has expired. Please request a new one.' 
      };
    }
    
    // Mark passcode as used by deleting it (one-time use)
    await db
      .delete(passcodes)
      .where(eq(passcodes.id, passcode.id));
    
    console.log(`✅ Passcode verified for ${email} (${type})`);
    return { success: true };
    
  } catch (error) {
    console.error('❌ Failed to verify passcode:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

// Clean up expired passcodes (can be called periodically)
export async function cleanupExpiredPasscodes(): Promise<void> {
  try {
    // Delete passcodes that are expired
    await db.delete(passcodes).where(
      sql`${passcodes.expiresAt} < NOW()`
    );
    
    console.log('✅ Cleaned up expired passcodes');
  } catch (error) {
    console.error('❌ Failed to cleanup expired passcodes:', error);
  }
}
