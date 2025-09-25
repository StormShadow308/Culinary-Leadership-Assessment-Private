import { NextRequest, NextResponse } from 'next/server';
import { db } from '~/db';
import { attempts, participants, organization } from '~/db/schema';
import { getCurrentUser } from '~/lib/user-sync';
import { eq, sql } from 'drizzle-orm';

export async function GET() {
  try {
    // Check if user is admin
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Get all attempts with participant and organization names
    const attemptsData = await db
      .select({
        id: attempts.id,
        participantId: attempts.participantId,
        assessmentId: attempts.assessmentId,
        organizationName: organization.name,
        participantName: participants.fullName,
        participantEmail: participants.email,
        status: attempts.status,
        startedAt: attempts.startedAt,
        completedAt: attempts.completedAt,
        reportData: attempts.reportData,
      })
      .from(attempts)
      .leftJoin(participants, eq(attempts.participantId, participants.id))
      .leftJoin(organization, eq(participants.organizationId, organization.id))
      .orderBy(attempts.startedAt);

    return NextResponse.json({ attempts: attemptsData });
  } catch (error) {
    console.error('Error fetching attempts:', error);
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

    const { participantId, assessmentId, status } = await request.json();

    if (!participantId || !assessmentId || !status) {
      return NextResponse.json({ error: 'Participant ID, assessment ID, and status are required' }, { status: 400 });
    }

    // Create new attempt using raw SQL
    const result = await db.execute(sql`
      INSERT INTO attempts (participant_id, assessment_id, status, started_at)
      VALUES (${participantId}, ${assessmentId}, ${status}, ${new Date().toISOString()})
      RETURNING *
    `);

    return NextResponse.json({ attempt: result.rows[0] });
  } catch (error) {
    console.error('Error creating attempt:', error);
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

    const { id, status, reportData } = await request.json();

    if (!id || !status) {
      return NextResponse.json({ error: 'ID and status are required' }, { status: 400 });
    }

    // Update attempt using raw SQL
    const result = await db.execute(sql`
      UPDATE attempts 
      SET status = ${status}, report_data = ${reportData ? JSON.stringify(reportData) : null}
      WHERE id = ${id}
      RETURNING *
    `);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Attempt not found' }, { status: 404 });
    }

    return NextResponse.json({ attempt: result.rows[0] });
  } catch (error) {
    console.error('Error updating attempt:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
