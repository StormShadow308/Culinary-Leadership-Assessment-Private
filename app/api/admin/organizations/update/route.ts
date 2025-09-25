import { NextRequest, NextResponse } from 'next/server';
import { db } from '~/db';
import { getCurrentUser } from '~/lib/user-sync';
import { sql } from 'drizzle-orm';

export async function PUT(request: NextRequest) {
  try {
    // Check if user is admin
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { id, name, metadata } = await request.json();

    if (!id || !name) {
      return NextResponse.json({ error: 'ID and name are required' }, { status: 400 });
    }

    // Update organization using raw SQL
    const result = await db.execute(sql`
      UPDATE organization 
      SET name = ${name}, metadata = ${metadata ? JSON.stringify(metadata) : null}
      WHERE id = ${id}
      RETURNING *
    `);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
    }

    return NextResponse.json({ organization: result.rows[0] });
  } catch (error) {
    console.error('Error updating organization:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
