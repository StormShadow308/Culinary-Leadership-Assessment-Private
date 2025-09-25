import { NextRequest, NextResponse } from 'next/server';
import { db } from '~/db';
import { assessments } from '~/db/schema';
import { getCurrentUser } from '~/lib/user-sync';
import { sql } from 'drizzle-orm';

export async function GET() {
  try {
    // Check if user is admin
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Get all assessments
    const assessmentsData = await db
      .select({
        id: assessments.id,
        title: assessments.title,
        description: assessments.description,
        createdAt: assessments.createdAt,
      })
      .from(assessments)
      .orderBy(assessments.createdAt);

    return NextResponse.json({ assessments: assessmentsData });
  } catch (error) {
    console.error('Error fetching assessments:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check if user is admin
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { title, description } = await request.json();

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    // Create new assessment using raw SQL
    const result = await db.execute(sql`
      INSERT INTO assessments (title, description)
      VALUES (${title}, ${description || ''})
      RETURNING *
    `);

    return NextResponse.json({ assessment: result.rows[0] });
  } catch (error) {
    console.error('Error creating assessment:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Check if user is admin
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { id, title, description } = await request.json();

    if (!id || !title) {
      return NextResponse.json({ error: 'ID and title are required' }, { status: 400 });
    }

    // Update assessment using raw SQL
    const result = await db.execute(sql`
      UPDATE assessments 
      SET title = ${title}, description = ${description || ''}
      WHERE id = ${id}
      RETURNING *
    `);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Assessment not found' }, { status: 404 });
    }

    return NextResponse.json({ assessment: result.rows[0] });
  } catch (error) {
    console.error('Error updating assessment:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
