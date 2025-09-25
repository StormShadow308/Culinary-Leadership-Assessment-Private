import { NextRequest, NextResponse } from 'next/server';
import { db } from '~/db';
import { participants } from '~/db/schema';
import { eq, sql } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    
    if (!email) {
      return NextResponse.redirect(new URL('/assessment', request.url));
    }

    // Check if participant exists
    const participantData = await db.execute(sql`
      SELECT id, full_name, email, organization_id, cohort_id, stay_out
      FROM participants 
      WHERE email = ${email}
      LIMIT 1
    `);

    if (participantData.rows.length === 0) {
      console.log('❌ Participant not found for email:', email);
      return NextResponse.redirect(new URL('/assessment', request.url));
    }

    const participant = participantData.rows[0];
    console.log('✅ Valid invite link for participant:', participant.full_name, participant.email);
    
    // Redirect to assessment page with participant info
    const assessmentUrl = new URL('/assessment', request.url);
    assessmentUrl.searchParams.set('invite', 'true');
    assessmentUrl.searchParams.set('participant', participant.id);
    assessmentUrl.searchParams.set('name', participant.full_name);
    
    return NextResponse.redirect(assessmentUrl);
    
  } catch (error) {
    console.error('Error processing invite link:', error);
    return NextResponse.redirect(new URL('/assessment', request.url));
  }
}
