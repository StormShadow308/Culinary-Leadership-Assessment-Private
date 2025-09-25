import { NextRequest, NextResponse } from 'next/server';
import { db } from '~/db';
import { participants, organization, cohorts } from '~/db/schema';
import { eq, sql } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    
    if (!email) {
      return NextResponse.json({ error: 'Email parameter is required' }, { status: 400 });
    }

    // Get participant with organization and cohort information
    const participantData = await db.execute(sql`
      SELECT 
        p.id,
        p.full_name,
        p.email,
        p.organization_id,
        p.cohort_id,
        o.name as organization_name,
        c.name as cohort_name
      FROM participants p
      LEFT JOIN organization o ON p.organization_id = o.id
      LEFT JOIN cohorts c ON p.cohort_id = c.id
      WHERE p.email = ${email}
      LIMIT 1
    `);

    if (participantData.rows.length === 0) {
      return NextResponse.json({ error: 'Participant not found' }, { status: 404 });
    }

    const participant = participantData.rows[0];

    return NextResponse.json({
      participant: {
        id: participant.id,
        fullName: participant.full_name,
        email: participant.email,
        organizationName: participant.organization_name,
        cohortName: participant.cohort_name,
      }
    });
    
  } catch (error) {
    console.error('Error fetching participant info:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
