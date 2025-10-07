import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '~/lib/user-sync';
import { SyncService } from '~/lib/sync-service';

export async function GET(request: NextRequest) {
  try {
    // Check if user is admin
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'status';

    console.log(`🔄 Admin sync request - Action: ${action}`);

    switch (action) {
      case 'status':
        const syncStatus = await SyncService.getSyncStatus();
        return NextResponse.json({
          success: true,
          data: syncStatus,
          summary: {
            total: syncStatus.length,
            inSync: syncStatus.filter(s => s.inSync).length,
            orphanedLocal: syncStatus.filter(s => s.localExists && !s.supabaseExists).length,
            orphanedSupabase: syncStatus.filter(s => !s.localExists && s.supabaseExists).length,
            inconsistent: syncStatus.filter(s => s.localExists && s.supabaseExists && !s.inSync).length
          }
        });

      case 'validate':
        const validation = await SyncService.validateDataIntegrity();
        return NextResponse.json({
          success: true,
          data: validation
        });

      case 'sync':
        const syncResult = await SyncService.syncAllUsers();
        return NextResponse.json({
          success: syncResult.success,
          data: syncResult
        });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

  } catch (error) {
    console.error('❌ Sync API error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check if user is admin
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { action, email } = await request.json();

    console.log(`🔄 Admin sync POST request - Action: ${action}, Email: ${email}`);

    switch (action) {
      case 'sync-user':
        if (!email) {
          return NextResponse.json({ error: 'Email is required for user sync' }, { status: 400 });
        }
        const userSyncResult = await SyncService.syncUserByEmail(email);
        return NextResponse.json({
          success: userSyncResult.success,
          message: userSyncResult.message
        });

      case 'sync-all':
        const syncResult = await SyncService.syncAllUsers();
        return NextResponse.json({
          success: syncResult.success,
          data: syncResult
        });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

  } catch (error) {
    console.error('❌ Sync POST API error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
