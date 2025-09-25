import { NextRequest, NextResponse } from 'next/server';
import { sendWelcomeEmail } from '~/lib/email-service';

export async function POST(request: NextRequest) {
  try {
    const { email, name, role } = await request.json();

    if (!email || !name || !role) {
      return NextResponse.json({ error: 'Email, name, and role are required' }, { status: 400 });
    }

    // Send welcome email using MailerSend
    try {
      await sendWelcomeEmail({
        email: email,
        name: name,
        role: role
      });

      console.log('✅ Welcome email sent via MailerSend to:', email);

      return NextResponse.json({ 
        success: true,
        message: 'Welcome email sent successfully'
      });

    } catch (emailError) {
      console.error('❌ Failed to send welcome email:', emailError);
      return NextResponse.json({ 
        error: 'Failed to send welcome email',
        details: emailError instanceof Error ? emailError.message : 'Unknown error'
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Welcome email error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
