import { NextRequest, NextResponse } from 'next/server';
import { generateAndSendPasscode } from '~/lib/passcode-service';

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Forgot password API called');
    
    const { email } = await request.json();
    console.log('📧 Email received:', email);

    if (!email) {
      console.log('❌ No email provided');
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    console.log('🔄 Generating passcode for password reset...');
    
    // Generate and send passcode for password reset
    const passcodeResult = await generateAndSendPasscode({
      email: email,
      type: 'password_reset'
    });

    console.log('📊 Passcode result:', passcodeResult);

    if (!passcodeResult.success) {
      console.error('❌ Passcode generation error:', passcodeResult.error);
      return NextResponse.json({ 
        error: 'Failed to send verification code. Please try again.',
        details: passcodeResult.error 
      }, { status: 500 });
    }

    console.log('✅ Password reset passcode sent to:', email);

    return NextResponse.json({ 
      success: true,
      message: 'A verification code has been sent to your email address. Please check your inbox and enter the code to reset your password.'
    });

  } catch (error) {
    console.error('❌ Password reset API error:', error);
    console.error('❌ Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined
    });
    
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
