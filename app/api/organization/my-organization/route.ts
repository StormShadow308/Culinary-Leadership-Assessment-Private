import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '~/lib/user-sync';
import { db } from '~/db';
import { organization, member } from '~/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Get user's organization membership
    const userMembership = await db
      .select({
        organizationId: member.organizationId,
      })
      .from(member)
      .where(eq(member.userId, currentUser.id))
      .limit(1);

    if (userMembership.length === 0) {
      return NextResponse.json({ organization: null });
    }

    // Get the organization details
    const org = await db
      .select({
        id: organization.id,
        name: organization.name,
        slug: organization.slug,
      })
      .from(organization)
      .where(eq(organization.id, userMembership[0].organizationId))
      .limit(1);

    if (org.length === 0) {
      return NextResponse.json({ organization: null });
    }

    return NextResponse.json({ organization: org[0] });
  } catch (error) {
    console.error('Error getting user organization:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
