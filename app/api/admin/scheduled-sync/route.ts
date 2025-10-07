import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '~/lib/user-sync';
import { ScheduledSync } from '~/lib/scheduled-sync';

export async function POST(request: NextRequest) {
  try {
    // Check if user is admin
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    console.log('🔄 Manual scheduled sync triggered by admin');

    const result = await ScheduledSync.runScheduledSync();

    return NextResponse.json({
      success: result.success,
      message: result.message,
      data: result.details
    });

  } catch (error) {
    console.error('❌ Scheduled sync API error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check if user is admin
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const status = ScheduledSync.getStatus();

    return NextResponse.json({
      success: true,
      data: status
    });

  } catch (error) {
    console.error('❌ Scheduled sync status API error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
