import { NextRequest, NextResponse } from 'next/server';
import { verifyPasscode } from '~/lib/passcode-service';

export async function POST(request: NextRequest) {
  try {
    const { email, code, type } = await request.json();

    if (!email || !code || !type) {
      return NextResponse.json({ 
        error: 'Email, code, and type are required' 
      }, { status: 400 });
    }

    if (!['registration', 'password_reset'].includes(type)) {
      return NextResponse.json({ 
        error: 'Invalid type. Must be "registration" or "password_reset"' 
      }, { status: 400 });
    }

    // Verify the passcode
    const result = await verifyPasscode(email, code, type as 'registration' | 'password_reset');

    if (!result.success) {
      return NextResponse.json({ 
        error: result.error || 'Invalid passcode' 
      }, { status: 400 });
    }

    return NextResponse.json({ 
      success: true,
      message: 'Passcode verified successfully'
    });

  } catch (error) {
    console.error('Passcode verification error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}
