import { NextRequest, NextResponse } from 'next/server';
import { db } from '~/db';
import { cohorts, organization, participants } from '~/db/schema';
import { getCurrentUser } from '~/lib/user-sync';
import { eq, and, sql } from 'drizzle-orm';

export async function GET() {
  try {
    // Check if user is admin
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Get all cohorts with organization names and participant counts
    const cohortsData = await db
      .select({
        id: cohorts.id,
        name: cohorts.name,
        organizationId: cohorts.organizationId,
        organizationName: organization.name,
        createdAt: cohorts.createdAt,
        updatedAt: cohorts.updatedAt,
        participantCount: sql<number>`COUNT(${participants.id})`.as('participantCount')
      })
      .from(cohorts)
      .leftJoin(organization, eq(cohorts.organizationId, organization.id))
      .leftJoin(participants, eq(cohorts.id, participants.cohortId))
      .groupBy(cohorts.id, cohorts.name, cohorts.organizationId, organization.name, cohorts.createdAt, cohorts.updatedAt)
      .orderBy(cohorts.createdAt);

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

    // Check if cohort with same name already exists in this organization
    const existingCohort = await db
      .select()
      .from(cohorts)
      .where(
        and(
          eq(cohorts.name, name),
          eq(cohorts.organizationId, organizationId)
        )
      )
      .limit(1);

    if (existingCohort.length > 0) {
      console.log('❌ Cohort already exists:', { name, organizationId });
      return NextResponse.json({ 
        error: 'A cohort with this name already exists in this organization',
        code: 'COHORT_EXISTS'
      }, { status: 409 });
    }

    // Create new cohort
    const [newCohort] = await db
      .insert(cohorts)
      .values({
        name,
        organizationId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .returning();

    console.log('✅ Cohort created successfully:', newCohort);
    return NextResponse.json({ cohort: newCohort });
  } catch (error) {
    console.error('Error creating cohort:', error);
    
    // Handle unique constraint violation
    if (error instanceof Error && error.message.includes('unique')) {
      return NextResponse.json({ 
        error: 'A cohort with this name already exists in this organization',
        code: 'COHORT_EXISTS'
      }, { status: 409 });
    }
    
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

    // Check if cohort exists
    const existingCohort = await db
      .select()
      .from(cohorts)
      .where(eq(cohorts.id, id))
      .limit(1);

    if (existingCohort.length === 0) {
      return NextResponse.json({ error: 'Cohort not found' }, { status: 404 });
    }

    // Check if another cohort with same name already exists in this organization
    const duplicateCohort = await db
      .select()
      .from(cohorts)
      .where(
        and(
          eq(cohorts.name, name),
          eq(cohorts.organizationId, organizationId),
          // Exclude the current cohort being updated
          sql`${cohorts.id} != ${id}`
        )
      )
      .limit(1);

    if (duplicateCohort.length > 0) {
      console.log('❌ Another cohort with this name already exists:', { name, organizationId });
      return NextResponse.json({ 
        error: 'Another cohort with this name already exists in this organization',
        code: 'COHORT_EXISTS'
      }, { status: 409 });
    }

    // Update cohort
    const [updatedCohort] = await db
      .update(cohorts)
      .set({
        name,
        organizationId,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(cohorts.id, id))
      .returning();

    console.log('✅ Cohort updated successfully:', updatedCohort);
    return NextResponse.json({ cohort: updatedCohort });
  } catch (error) {
    console.error('Error updating cohort:', error);
    
    // Handle unique constraint violation
    if (error instanceof Error && error.message.includes('unique')) {
      return NextResponse.json({ 
        error: 'Another cohort with this name already exists in this organization',
        code: 'COHORT_EXISTS'
      }, { status: 409 });
    }
    
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
