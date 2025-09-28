import { NextRequest, NextResponse } from 'next/server';
import { db } from '~/db';
import { organization, member, cohorts } from '~/db/schema';
import { getCurrentUser } from '~/lib/user-sync';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated and has organization role
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (currentUser.role !== 'organization') {
      return NextResponse.json({ error: 'Only organization users can create organizations' }, { status: 403 });
    }

    const { name, description } = await request.json();

    if (!name) {
      return NextResponse.json({ error: 'Organization name is required' }, { status: 400 });
    }

    // Check if user already has an organization membership
    const existingMembership = await db
      .select()
      .from(member)
      .where(eq(member.userId, currentUser.id))
      .limit(1);

    if (existingMembership.length > 0) {
      return NextResponse.json({ 
        error: 'User already has an organization membership',
        existingOrganization: existingMembership[0].organizationId
      }, { status: 400 });
    }

    // Generate unique organization ID and slug
    const orgId = `org_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const orgSlug = name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    
    // Create new organization
    const [newOrganization] = await db
      .insert(organization)
      .values({
        id: orgId,
        name,
        slug: orgSlug,
        metadata: description ? JSON.stringify({ description }) : null,
        createdAt: new Date(),
      })
      .returning();

    // Create membership for the user
    const [newMembership] = await db
      .insert(member)
      .values({
        id: `member_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        organizationId: orgId,
        userId: currentUser.id,
        role: 'owner',
        createdAt: new Date(),
      })
      .returning();

    // Create predefined cohorts for the organization
    const predefinedCohorts = [
      'Fall 2024 Leadership Cohort',
      'Spring 2025 Advanced Cohort',
      'Summer 2025 Intensive Cohort',
      'Executive Leadership Program',
      'Culinary Management Cohort'
    ];

    const createdCohorts = [];
    for (const cohortName of predefinedCohorts) {
      const [newCohort] = await db
        .insert(cohorts)
        .values({
          organizationId: orgId,
          name: cohortName,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
        .returning();
      createdCohorts.push(newCohort);
    }

    console.log('✅ Organization created successfully:', {
      organizationId: orgId,
      organizationName: name,
      userId: currentUser.id,
      cohortsCreated: createdCohorts.length,
      cohortNames: createdCohorts.map(c => c.name),
    });

    return NextResponse.json({ 
      organization: newOrganization,
      membership: newMembership,
      cohorts: createdCohorts,
      message: 'Organization created successfully with predefined cohorts'
    });
  } catch (error) {
    console.error('Error creating organization:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
