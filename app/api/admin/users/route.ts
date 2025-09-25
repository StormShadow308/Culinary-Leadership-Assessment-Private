import { NextResponse } from 'next/server';
import { db } from '~/db';
import { user } from '~/db/schema';
import { getCurrentUser } from '~/lib/user-sync';

export async function GET() {
  try {
    // Check if user is admin
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Get all users
    const users = await db.select().from(user);

    return NextResponse.json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
