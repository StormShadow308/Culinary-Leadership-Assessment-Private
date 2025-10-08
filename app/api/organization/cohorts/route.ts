import { NextRequest, NextResponse } from 'next/server';
import { db } from '~/db';
import { cohorts, participants, organization, member } from '~/db/schema';
import { getCurrentUser } from '~/lib/user-sync';
import { eq, and, sql } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Cohorts API: Starting request');
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      console.log('❌ Cohorts API: No current user');
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    console.log('✅ Cohorts API: Current user found:', currentUser.email, currentUser.role);

    // Security check: Only organization users can access this endpoint
    if (currentUser.role !== 'organization') {
      console.log('❌ Cohorts API: Access denied - user is not an organization user');
      return NextResponse.json({ error: 'Access denied - organization users only' }, { status: 403 });
    }

    // Get user's organization
    const userMembership = await db
      .select({ organizationId: member.organizationId })
      .from(member)
      .where(eq(member.userId, currentUser.id))
      .limit(1);

    console.log('🔍 Cohorts API: User membership:', userMembership);

    if (userMembership.length === 0) {
      console.log('❌ Cohorts API: User not associated with organization');
      return NextResponse.json({ error: 'User is not associated with an organization' }, { status: 403 });
    }

    const organizationId = userMembership[0].organizationId;
    console.log('✅ Cohorts API: Organization ID:', organizationId);

    // Get all cohorts for this organization with participant counts
    const cohortsData = await db
      .select({
        id: cohorts.id,
        name: cohorts.name,
        organizationId: cohorts.organizationId,
        createdAt: cohorts.createdAt,
        updatedAt: cohorts.updatedAt,
        participantCount: sql<number>`COUNT(${participants.id})`.as('participantCount')
      })
      .from(cohorts)
      .leftJoin(participants, eq(cohorts.id, participants.cohortId))
      .where(eq(cohorts.organizationId, organizationId))
      .groupBy(cohorts.id, cohorts.name, cohorts.organizationId, cohorts.createdAt, cohorts.updatedAt);

    // Security check: Ensure all returned cohorts belong to the user's organization
    const unauthorizedCohorts = cohortsData.filter(cohort => cohort.organizationId !== organizationId);
    if (unauthorizedCohorts.length > 0) {
      console.error('🚨 SECURITY VIOLATION: Unauthorized cohorts detected:', unauthorizedCohorts);
      return NextResponse.json({ error: 'Security violation detected' }, { status: 500 });
    }

    console.log('✅ Cohorts API: Cohorts data (security verified):', cohortsData);
    return NextResponse.json({ cohorts: cohortsData });
  } catch (error) {
    console.error('Error fetching organization cohorts:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Get user's organization
    const userMembership = await db
      .select({ organizationId: member.organizationId })
      .from(member)
      .where(eq(member.userId, currentUser.id))
      .limit(1);

    if (userMembership.length === 0) {
      return NextResponse.json({ error: 'User is not associated with an organization' }, { status: 403 });
    }

    const organizationId = userMembership[0].organizationId;
    const { name } = await request.json();

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Cohort name is required' }, { status: 400 });
    }

    // Check if cohort with same name already exists in this organization
    const existingCohort = await db
      .select()
      .from(cohorts)
      .where(
        and(
          eq(cohorts.name, name.trim()),
          eq(cohorts.organizationId, organizationId)
        )
      )
      .limit(1);

    if (existingCohort.length > 0) {
      return NextResponse.json({ 
        error: 'A cohort with this name already exists in your organization',
        code: 'COHORT_EXISTS'
      }, { status: 409 });
    }

    // Create new cohort
    const [newCohort] = await db
      .insert(cohorts)
      .values({
        name: name.trim(),
        organizationId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .returning();

    console.log('✅ Organization cohort created successfully:', newCohort);
    return NextResponse.json({ cohort: newCohort });
  } catch (error) {
    console.error('Error creating organization cohort:', error);
    
    // Handle unique constraint violation
    if (error instanceof Error && error.message.includes('unique')) {
      return NextResponse.json({ 
        error: 'A cohort with this name already exists in your organization',
        code: 'COHORT_EXISTS'
      }, { status: 409 });
    }
    
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Get user's organization
    const userMembership = await db
      .select({ organizationId: member.organizationId })
      .from(member)
      .where(eq(member.userId, currentUser.id))
      .limit(1);

    if (userMembership.length === 0) {
      return NextResponse.json({ error: 'User is not associated with an organization' }, { status: 403 });
    }

    const organizationId = userMembership[0].organizationId;
    const { id, name } = await request.json();

    if (!id || !name || !name.trim()) {
      return NextResponse.json({ error: 'Cohort ID and name are required' }, { status: 400 });
    }

    // Check if cohort exists and belongs to user's organization
    const existingCohort = await db
      .select()
      .from(cohorts)
      .where(
        and(
          eq(cohorts.id, id),
          eq(cohorts.organizationId, organizationId)
        )
      )
      .limit(1);

    if (existingCohort.length === 0) {
      return NextResponse.json({ error: 'Cohort not found or access denied' }, { status: 404 });
    }

    // Check if another cohort with same name already exists in this organization
    const duplicateCohort = await db
      .select()
      .from(cohorts)
      .where(
        and(
          eq(cohorts.name, name.trim()),
          eq(cohorts.organizationId, organizationId),
          // Exclude the current cohort being updated
          sql`${cohorts.id} != ${id}`
        )
      )
      .limit(1);

    if (duplicateCohort.length > 0) {
      return NextResponse.json({ 
        error: 'Another cohort with this name already exists in your organization',
        code: 'COHORT_EXISTS'
      }, { status: 409 });
    }

    // Update cohort
    const [updatedCohort] = await db
      .update(cohorts)
      .set({
        name: name.trim(),
        updatedAt: new Date().toISOString(),
      })
      .where(eq(cohorts.id, id))
      .returning();

    console.log('✅ Organization cohort updated successfully:', updatedCohort);
    return NextResponse.json({ cohort: updatedCohort });
  } catch (error) {
    console.error('Error updating organization cohort:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
