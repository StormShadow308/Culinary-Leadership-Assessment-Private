'use server';

import { NextRequest, NextResponse } from 'next/server';
import { db } from '~/db';
import { cohorts, organization } from '~/db/schema';
import { getCurrentUser } from '~/lib/user-sync';
import { eq } from 'drizzle-orm';

/**
 * API endpoint to create predefined generic cohorts for the N/A organization
 * Only accessible by admin users
 */
export async function POST(request: NextRequest) {
  try {
    console.log('🎓 Setting up default cohorts for N/A organization...');
    
    // Verify admin access
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Admin access required' },
        { status: 403 }
      );
    }

    // Verify the N/A organization exists
    const naOrg = await db
      .select({ id: organization.id })
      .from(organization)
      .where(eq(organization.id, 'org_default_students'))
      .limit(1)
      .execute();

    if (naOrg.length === 0) {
      return NextResponse.json(
        { error: 'Organization not found', message: 'N/A organization does not exist' },
        { status: 404 }
      );
    }

    // Check if cohorts already exist
    const existingCohorts = await db
      .select()
      .from(cohorts)
      .where(eq(cohorts.organizationId, 'org_default_students'))
      .execute();

    if (existingCohorts.length > 0) {
      console.log('✅ Default cohorts already exist:', existingCohorts.length);
      return NextResponse.json({
        success: true,
        message: 'Default cohorts already exist',
        cohorts: existingCohorts,
      });
    }

    // Create predefined generic cohorts for N/A organization
    const predefinedCohorts = [
      'General Assessment Group',
      'Independent Learners',
      'Self-Directed Students',
      'Open Enrollment',
      'Unassigned Participants'
    ];

    const createdCohorts = [];
    
    for (const cohortName of predefinedCohorts) {
      try {
        const [newCohort] = await db
          .insert(cohorts)
          // @ts-expect-error - Drizzle ORM type inference issue with timestamp fields
          .values({
            organizationId: 'org_default_students',
            name: cohortName,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          })
          .returning()
          .execute();
        
        createdCohorts.push(newCohort);
        console.log(`✅ Created cohort: ${cohortName}`);
      } catch (error: any) {
        // If cohort already exists (duplicate), skip it
        if (error.code === '23505') {
          console.log(`⚠️ Cohort already exists: ${cohortName}`);
        } else {
          throw error;
        }
      }
    }

    console.log('✅ Default cohorts setup completed:', createdCohorts.length);

    return NextResponse.json({
      success: true,
      message: `Created ${createdCohorts.length} default cohorts`,
      cohorts: createdCohorts,
    });

  } catch (error) {
    console.error('❌ Error setting up default cohorts:', error);
    return NextResponse.json(
      {
        error: 'Setup failed',
        message: error instanceof Error ? error.message : 'Failed to setup default cohorts'
      },
      { status: 500 }
    );
  }
}
