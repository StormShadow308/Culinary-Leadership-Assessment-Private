import { NextRequest, NextResponse } from 'next/server';
import { db } from '~/db';
import { organization, member, cohorts } from '~/db/schema';
import { getCurrentUser } from '~/lib/user-sync';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated and has organization role
    const currentUser = await getCurrentUser();
    console.log('🔍 Organization creation request from user:', currentUser?.email, 'Role:', currentUser?.role);
    
    if (!currentUser) {
      console.log('❌ No current user found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (currentUser.role !== 'organization') {
      console.log('❌ User role is not organization:', currentUser.role);
      return NextResponse.json({ error: 'Only organization users can create organizations' }, { status: 403 });
    }

    const { name, description } = await request.json();

    if (!name) {
      return NextResponse.json({ error: 'Organization name is required' }, { status: 400 });
    }

    // Check if user already has an organization membership
    console.log('🔍 Checking existing membership for user:', currentUser.id);
    const existingMembership = await db
      .select()
      .from(member)
      .where(eq(member.userId, currentUser.id))
      .limit(1);

    console.log('📊 Existing membership found:', existingMembership.length > 0);

    if (existingMembership.length > 0) {
      console.log('⚠️ User already has organization membership:', existingMembership[0].organizationId);
      return NextResponse.json({ 
        error: 'User already has an organization membership',
        existingOrganization: existingMembership[0].organizationId
      }, { status: 400 });
    }

    // Generate unique organization ID and slug
    const orgId = `org_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const orgSlug = name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    
    console.log('🏢 Creating organization:', { orgId, name, orgSlug });
    
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

    console.log('✅ Organization created:', newOrganization);

    // Create membership for the user
    const membershipId = `member_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    console.log('👤 Creating membership:', { membershipId, organizationId: orgId, userId: currentUser.id });
    
    const [newMembership] = await db
      .insert(member)
      .values({
        id: membershipId,
        organizationId: orgId,
        userId: currentUser.id,
        role: 'owner',
        createdAt: new Date(),
      })
      .returning();

    console.log('✅ Membership created:', newMembership);

    // Create predefined cohorts for regular organizations only
    // Skip system organizations like N/A (default students)
    const createdCohorts = [];
    
    // Check if this is a system organization that shouldn't get cohorts
    const isSystemOrg = orgId === 'org_default_students' || name === 'N/A';
    
    if (!isSystemOrg) {
      console.log('🎓 Creating cohorts for new organization...');
      const predefinedCohorts = [
        'Fall 2024 Leadership Cohort',
        'Spring 2025 Advanced Cohort', 
        'Summer 2025 Intensive Cohort',
        'Executive Leadership Program',
        'Culinary Management Cohort',
        'Culinary Leadership Cohort 1',
        'Culinary Leadership Cohort 2',
        'Culinary Leadership Cohort 3'
      ];

      for (const cohortName of predefinedCohorts) {
        try {
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
          console.log('✅ Created cohort:', cohortName);
        } catch (cohortError) {
          console.error('❌ Failed to create cohort:', cohortName, cohortError);
          // Continue creating other cohorts even if one fails
        }
      }
    } else {
      console.log('⏭️ Skipping cohort creation for system organization:', name);
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
      message: `Organization created successfully with ${createdCohorts.length} predefined cohorts`
    });
  } catch (error) {
    console.error('Error creating organization:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
