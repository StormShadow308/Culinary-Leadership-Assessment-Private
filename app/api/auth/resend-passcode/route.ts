import { NextRequest, NextResponse } from 'next/server';
import { generateAndSendPasscode } from '~/lib/passcode-service';

export async function POST(request: NextRequest) {
  try {
    const { email, type } = await request.json();

    if (!email || !type) {
      return NextResponse.json({ 
        error: 'Email and type are required' 
      }, { status: 400 });
    }

    if (!['registration', 'password_reset'].includes(type)) {
      return NextResponse.json({ 
        error: 'Invalid type. Must be "registration" or "password_reset"' 
      }, { status: 400 });
    }

    // Generate and send new passcode
    const result = await generateAndSendPasscode({
      email,
      type: type as 'registration' | 'password_reset'
    });

    if (!result.success) {
      return NextResponse.json({ 
        error: result.error || 'Failed to send passcode' 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true,
      message: 'Passcode sent successfully'
    });

  } catch (error) {
    console.error('Resend passcode error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}
