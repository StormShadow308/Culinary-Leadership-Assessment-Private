import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '~/lib/user-sync';
import { SessionManager } from '~/lib/session-manager';
import { RateLimiter } from '~/lib/rate-limiter';
import { ConcurrentUserMiddleware } from '~/lib/concurrent-user-middleware';

export async function GET(request: NextRequest) {
  try {
    // Check if user is admin
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    console.log('📊 Fetching monitoring stats...');

    // Get session statistics
    const sessionStats = await SessionManager.getSessionStats();
    
    // Get rate limiting statistics
    const rateLimitStats = RateLimiter.getStats();
    
    // Get concurrent user statistics
    const concurrentStats = ConcurrentUserMiddleware.getStats();

    const stats = {
      activeUsers: concurrentStats.activeUsers,
      maxUsers: concurrentStats.maxUsers,
      utilizationPercent: concurrentStats.utilizationPercent,
      rateLimitStats,
      sessionStats
    };

    console.log('✅ Monitoring stats fetched:', stats);

    return NextResponse.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('❌ Error fetching monitoring stats:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
