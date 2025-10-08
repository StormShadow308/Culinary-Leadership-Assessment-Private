import { NextRequest, NextResponse } from 'next/server';
import { db } from '~/db';
import { cohorts, participants, member } from '~/db/schema';
import { getCurrentUser } from '~/lib/user-sync';
import { eq, and } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { cohortId: string } }
) {
  try {
    console.log('🔍 Students API: Starting request for cohortId:', params.cohortId);
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      console.log('❌ Students API: No current user');
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { cohortId } = params;
    console.log('✅ Students API: Current user found:', currentUser.email, currentUser.role);

    // Security check: Only organization users can access this endpoint
    if (currentUser.role !== 'organization') {
      console.log('❌ Students API: Access denied - user is not an organization user');
      return NextResponse.json({ error: 'Access denied - organization users only' }, { status: 403 });
    }

    // Get user's organization
    const userMembership = await db
      .select({ organizationId: member.organizationId })
      .from(member)
      .where(eq(member.userId, currentUser.id))
      .limit(1);

    console.log('🔍 Students API: User membership:', userMembership);

    if (userMembership.length === 0) {
      console.log('❌ Students API: User not associated with organization');
      return NextResponse.json({ error: 'User is not associated with an organization' }, { status: 403 });
    }

    const organizationId = userMembership[0].organizationId;
    console.log('✅ Students API: Organization ID:', organizationId);

    // Verify cohort exists and belongs to user's organization
    const cohort = await db
      .select()
      .from(cohorts)
      .where(
        and(
          eq(cohorts.id, cohortId),
          eq(cohorts.organizationId, organizationId)
        )
      )
      .limit(1);

    console.log('🔍 Students API: Cohort verification:', cohort);

    if (cohort.length === 0) {
      console.log('❌ Students API: Cohort not found or access denied');
      return NextResponse.json({ error: 'Cohort not found or access denied' }, { status: 404 });
    }

    // Get all students in this cohort
    const students = await db
      .select({
        id: participants.id,
        email: participants.email,
        fullName: participants.fullName,
        stayOut: participants.stayOut,
        createdAt: participants.createdAt,
        lastActiveAt: participants.lastActiveAt,
        cohortId: participants.cohortId,
        cohortName: cohorts.name,
        organizationId: cohorts.organizationId,
      })
      .from(participants)
      .innerJoin(cohorts, eq(participants.cohortId, cohorts.id))
      .where(eq(participants.cohortId, cohortId))
      .orderBy(participants.fullName);

    // Security check: Ensure all returned students belong to the user's organization
    const unauthorizedStudents = students.filter(student => student.organizationId !== organizationId);
    if (unauthorizedStudents.length > 0) {
      console.error('🚨 SECURITY VIOLATION: Unauthorized students detected:', unauthorizedStudents);
      return NextResponse.json({ error: 'Security violation detected' }, { status: 500 });
    }

    // Remove organizationId from response for security
    const sanitizedStudents = students.map(student => {
      const { organizationId, ...sanitizedStudent } = student;
      return sanitizedStudent;
    });

    console.log('✅ Students API: Students data (security verified):', sanitizedStudents);
    return NextResponse.json({ students: sanitizedStudents });
  } catch (error) {
    console.error('Error fetching cohort students:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
