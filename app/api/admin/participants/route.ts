import { NextRequest, NextResponse } from 'next/server';
import { db } from '~/db';
import { participants, organization, cohorts } from '~/db/schema';
import { getCurrentUser } from '~/lib/user-sync';
import { eq, sql } from 'drizzle-orm';
import { sendInvitationEmail, generateInviteLink } from '~/lib/invitation-service';

export async function GET() {
  try {
    // Check if user is admin
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Get all participants with organization and cohort names
    const participantsData = await db
      .select({
        id: participants.id,
        fullName: participants.fullName,
        email: participants.email,
        organizationId: participants.organizationId,
        organizationName: organization.name,
        cohortId: participants.cohortId,
        cohortName: cohorts.name,
        stayOut: participants.stayOut,
        createdAt: participants.createdAt,
        lastActiveAt: participants.lastActiveAt,
      })
      .from(participants)
      .leftJoin(organization, eq(participants.organizationId, organization.id))
      .leftJoin(cohorts, eq(participants.cohortId, cohorts.id));

    return NextResponse.json({ participants: participantsData });
  } catch (error) {
    console.error('Error fetching participants:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check if user is admin
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { fullName, email, organizationId, cohortId, stayOut } = await request.json();

    if (!fullName || !email || !organizationId) {
      return NextResponse.json({ error: 'Full name, email, and organization ID are required' }, { status: 400 });
    }

    // Create new participant using raw SQL to avoid schema issues
    const result = await db.execute(sql`
      INSERT INTO participants (full_name, email, organization_id, cohort_id, stay_out)
      VALUES (${fullName}, ${email}, ${organizationId}, ${cohortId || null}, ${stayOut ? 'Opt Out' : 'Stay'})
      RETURNING *
    `);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Failed to create participant' }, { status: 500 });
    }

    const newParticipant = result.rows[0];

    // Get organization and cohort names for the invitation email
    const orgData = await db.execute(sql`
      SELECT name FROM organization WHERE id = ${organizationId}
    `);
    
    let cohortName = null;
    if (cohortId) {
      const cohortData = await db.execute(sql`
        SELECT name FROM cohorts WHERE id = ${cohortId}
      `);
      cohortName = cohortData.rows[0]?.name || null;
    }

    // Generate invite link
    const inviteLink = generateInviteLink(email);
    
    // Send invitation email
    let invitationSent = false;
    try {
      console.log('📧 Sending invitation email to:', email);
      console.log('🔗 Invite link:', inviteLink);
      
      const emailResult = await sendInvitationEmail({
        participantName: fullName,
        participantEmail: email,
        organizationName: orgData.rows[0]?.name || 'Unknown Organization',
        cohortName: cohortName,
        inviteLink: inviteLink
      });

      if (!emailResult.success) {
        console.error('❌ Failed to send invitation email:', emailResult.error);
        invitationSent = false;
      } else {
        console.log('✅ Invitation email sent successfully to:', email);
        invitationSent = true;
      }
    } catch (emailError) {
      console.error('❌ Error sending invitation email:', emailError);
      invitationSent = false;
    }

    return NextResponse.json({ 
      participant: newParticipant,
      invitationSent: invitationSent,
      inviteLink: inviteLink
    });
  } catch (error) {
    console.error('Error creating participant:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Check if user is admin
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { id, fullName, email, organizationId, cohortId, stayOut } = await request.json();

    if (!id || !fullName || !email || !organizationId) {
      return NextResponse.json({ error: 'ID, full name, email, and organization ID are required' }, { status: 400 });
    }

    // Update participant using raw SQL
    const result = await db.execute(sql`
      UPDATE participants 
      SET full_name = ${fullName}, email = ${email}, organization_id = ${organizationId}, cohort_id = ${cohortId || null}, stay_out = ${stayOut ? 'Opt Out' : 'Stay'}
      WHERE id = ${id}
      RETURNING *
    `);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Participant not found' }, { status: 404 });
    }

    return NextResponse.json({ participant: result.rows[0] });
  } catch (error) {
    console.error('Error updating participant:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}