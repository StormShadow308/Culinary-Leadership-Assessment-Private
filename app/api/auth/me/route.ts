import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '~/lib/user-sync';
import { withRateLimit } from '~/lib/rate-limiter';

async function handler(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    return NextResponse.json({
      id: currentUser.id,
      email: currentUser.email,
      name: currentUser.name,
      role: currentUser.role,
      emailVerified: currentUser.emailVerified,
    });
  } catch (error) {
    console.error('Error getting current user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export const GET = withRateLimit(handler);
