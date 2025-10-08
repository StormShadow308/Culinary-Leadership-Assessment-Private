import { NextRequest, NextResponse } from 'next/server';
import { db } from '~/db';
import { cohorts, member } from '~/db/schema';
import { getCurrentUser } from '~/lib/user-sync';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
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

    // Get all cohorts for this organization
    const cohortsData = await db
      .select({
        id: cohorts.id,
        name: cohorts.name,
        organizationId: cohorts.organizationId,
      })
      .from(cohorts)
      .where(eq(cohorts.organizationId, organizationId))
      .orderBy(cohorts.name);

    return NextResponse.json({ cohorts: cohortsData });
  } catch (error) {
    console.error('Error fetching organization cohorts list:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
