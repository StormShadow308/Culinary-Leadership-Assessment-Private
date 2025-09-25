import { NextResponse } from 'next/server';
import { db } from '~/db';
import { organization } from '~/db/schema';
import { getCurrentUser } from '~/lib/user-sync';

export async function GET() {
  try {
    // Check if user is admin
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Get all organizations
    const organizations = await db.select().from(organization);

    return NextResponse.json({ organizations });
  } catch (error) {
    console.error('Error fetching organizations:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
