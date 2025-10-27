import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '~/lib/user-sync';
import { db } from '~/db';
import { session, user } from '~/db/schema';
import { eq, and, gte } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    // Check if user is admin
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    console.log('📊 Fetching user activity...');

    // Get active sessions with user data
    const activeSessions = await db
      .select({
        sessionId: session.id,
        userId: session.userId,
        createdAt: session.createdAt,
        ipAddress: session.ipAddress,
        userAgent: session.userAgent,
        userEmail: user.email,
        userRole: user.role,
      })
      .from(session)
      .leftJoin(user, eq(session.userId, user.id))
      .where(gte(session.expiresAt, new Date()))
      .orderBy(session.createdAt)
      .limit(50); // Limit to last 50 active users

    // Format the data
    const userActivity = activeSessions.map(s => ({
      userId: s.userId || 'unknown',
      email: s.userEmail || 'unknown',
      role: s.userRole || 'unknown',
      lastActivity: s.createdAt ? new Date(s.createdAt).toLocaleString() : 'unknown',
      ipAddress: s.ipAddress || 'unknown',
      userAgent: s.userAgent || 'unknown',
      sessionId: s.sessionId
    }));

    console.log(`✅ Found ${userActivity.length} active users`);

    return NextResponse.json({
      success: true,
      data: userActivity
    });

  } catch (error) {
    console.error('❌ Error fetching user activity:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
