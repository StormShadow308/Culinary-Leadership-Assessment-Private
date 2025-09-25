import { NextRequest, NextResponse } from 'next/server';
import { db } from '~/db';
import { cohorts } from '~/db/schema';
import { getCurrentUser } from '~/lib/user-sync';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    // Check if user is admin
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Get all cohorts with organization names
    const cohortsData = await db
      .select({
        id: cohorts.id,
        name: cohorts.name,
        organizationId: cohorts.organizationId,
        createdAt: cohorts.createdAt,
        updatedAt: cohorts.updatedAt,
      })
      .from(cohorts);

    return NextResponse.json({ cohorts: cohortsData });
  } catch (error) {
    console.error('Error fetching cohorts:', error);
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

    const { name, organizationId } = await request.json();

    if (!name || !organizationId) {
      return NextResponse.json({ error: 'Name and organization ID are required' }, { status: 400 });
    }

    // Create new cohort
    const [newCohort] = await db
      .insert(cohorts)
      .values({
        name,
        organizationId,
      })
      .returning();

    return NextResponse.json({ cohort: newCohort });
  } catch (error) {
    console.error('Error creating cohort:', error);
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

    const { id, name, organizationId } = await request.json();

    if (!id || !name || !organizationId) {
      return NextResponse.json({ error: 'ID, name, and organization ID are required' }, { status: 400 });
    }

    // Update cohort
    const [updatedCohort] = await db
      .update(cohorts)
      .set({
        name,
        organizationId,
      })
      .where(eq(cohorts.id, id))
      .returning();

    if (!updatedCohort) {
      return NextResponse.json({ error: 'Cohort not found' }, { status: 404 });
    }

    return NextResponse.json({ cohort: updatedCohort });
  } catch (error) {
    console.error('Error updating cohort:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
