import { NextResponse } from 'next/server';
import { db } from '~/db';
import { organization, member } from '~/db/schema';
import { getCurrentUser } from '~/lib/user-sync';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    // Check if user is authenticated
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Security check: Only organization users and admins can access this endpoint
    if (currentUser.role !== 'organization' && currentUser.role !== 'admin') {
      return NextResponse.json({ error: 'Access denied - organization users and admins only' }, { status: 403 });
    }

    // Check if user has an organization membership (skip for admin users)
    let membership;
    if (currentUser.role === 'admin') {
      // Admin users don't need organization membership
      return NextResponse.json({ 
        hasOrganization: true,
        isAdmin: true,
        message: 'Admin user - has access to all organizations'
      });
    } else {
      // Organization users need membership
      membership = await db
        .select({
          id: member.id,
          organizationId: member.organizationId,
          role: member.role,
          createdAt: member.createdAt,
          organizationName: organization.name,
          organizationSlug: organization.slug,
          organizationMetadata: organization.metadata,
        })
        .from(member)
        .innerJoin(organization, eq(member.organizationId, organization.id))
        .where(eq(member.userId, currentUser.id))
        .limit(1);
    }

    if (membership.length === 0) {
      return NextResponse.json({ 
        hasOrganization: false,
        message: 'User does not have an organization membership'
      });
    }

    const membershipData = membership[0];
    
    // Parse organization metadata
    let organizationDescription = null;
    try {
      if (membershipData.organizationMetadata) {
        const metadata = JSON.parse(membershipData.organizationMetadata);
        organizationDescription = metadata.description || null;
      }
    } catch (error) {
      console.warn('Failed to parse organization metadata:', error);
    }

    return NextResponse.json({ 
      hasOrganization: true,
      organization: {
        id: membershipData.organizationId,
        name: membershipData.organizationName,
        slug: membershipData.organizationSlug,
        description: organizationDescription,
        createdAt: membershipData.createdAt,
      },
      membership: {
        id: membershipData.id,
        role: membershipData.role,
        createdAt: membershipData.createdAt,
      }
    });
  } catch (error) {
    console.error('Error checking organization status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
