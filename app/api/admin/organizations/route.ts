import { NextRequest, NextResponse } from 'next/server';
import { db } from '~/db';
import { organization, member, cohorts, participants } from '~/db/schema';
import { getCurrentUser } from '~/lib/user-sync';
import { eq, count } from 'drizzle-orm';

export async function GET() {
  try {
    console.log('🔍 Fetching organizations...');
    
    // Check if user is admin
    const currentUser = await getCurrentUser();
    console.log('👤 Current user:', currentUser ? { id: currentUser.id, email: currentUser.email, role: currentUser.role } : 'null');
    
    if (!currentUser) {
      console.log('❌ No user found - authentication failed');
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    
    if (currentUser.role !== 'admin') {
      console.log('❌ User is not admin:', currentUser.role);
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    console.log('✅ User authorized, fetching organizations...');

    // Get all organizations
    const organizations = await db.select().from(organization);
    console.log(`📊 Found ${organizations.length} organizations`);
    
    // Get participant counts for each organization
    const organizationsWithCounts = await Promise.all(
      organizations.map(async (org) => {
        const [participantCountResult] = await db
          .select({ count: count() })
          .from(participants)
          .where(eq(participants.organizationId, org.id));
        
        return {
          ...org,
          participantCount: participantCountResult?.count || 0
        };
      })
    );

    console.log('✅ Organizations with counts fetched successfully');
    return NextResponse.json({ organizations: organizationsWithCounts });
  } catch (error) {
    console.error('❌ Error fetching organizations:', error);
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check if user is admin
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { name, description, slug } = await request.json();

    if (!name) {
      return NextResponse.json({ error: 'Organization name is required' }, { status: 400 });
    }

    // Generate slug if not provided
    const orgSlug = slug || name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    
    // Create new organization
    const orgId = `org_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
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

    console.log('✅ Admin created organization with predefined cohorts:', {
      organizationId: orgId,
      organizationName: name,
      cohortsCreated: createdCohorts.length,
      cohortNames: createdCohorts.map(c => c.name),
    });

    return NextResponse.json({ 
      organization: newOrganization,
      cohorts: createdCohorts,
      message: 'Organization created successfully with predefined cohorts'
    });
  } catch (error) {
    console.error('Error creating organization:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
