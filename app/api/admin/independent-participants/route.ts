import { NextResponse } from 'next/server';
import { db } from '~/db';
import { participants, attempts, cohorts, organization } from '~/db/schema';
import { eq, and, isNotNull, sql } from 'drizzle-orm';

interface ReportData {
  totalScore: number;
  totalPossible: number;
}

export async function GET() {
  try {
    // First, find the N/A organization ID
    const naOrg = await db
      .select({ id: organization.id })
      .from(organization)
      .where(eq(organization.name, 'N/A Organization'))
      .limit(1);

    if (!naOrg || naOrg.length === 0) {
      return NextResponse.json({ participants: [] });
    }

    const naOrgId = naOrg[0].id;

    // Fetch all participants from the N/A organization
    const independentParticipants = await db
      .select({
        id: participants.id,
        email: participants.email,
        fullName: participants.fullName,
        cohortId: participants.cohortId,
      })
      .from(participants)
      .where(eq(participants.organizationId, naOrgId));

    // Fetch cohort names
    const cohortIds = [...new Set(independentParticipants.map(p => p.cohortId).filter(Boolean))];
    const cohortData = cohortIds.length > 0
      ? await db.select({ id: cohorts.id, name: cohorts.name }).from(cohorts).where(sql`id = ANY(${cohortIds})`)
      : [];
    
    const cohortMap = new Map(cohortData.map(c => [c.id, c.name]));

    // Fetch assessment data for all participants
    const participantIds = independentParticipants.map(p => p.id);
    const assessmentData = participantIds.length > 0
      ? await db
          .select({
            participantId: attempts.participantId,
            type: attempts.type,
            status: attempts.status,
            reportData: sql<ReportData>`report_data`,
          })
          .from(attempts)
          .where(
            and(
              sql`participant_id = ANY(${participantIds})`,
              isNotNull(attempts.completedAt)
            )
          )
      : [];

    // Organize assessment data by participant
    const assessmentMap = new Map<string, { pre: any; post: any }>();
    assessmentData.forEach(a => {
      if (!assessmentMap.has(a.participantId)) {
        assessmentMap.set(a.participantId, { pre: null, post: null });
      }
      const data = assessmentMap.get(a.participantId)!;
      if (a.type === 'pre_assessment') {
        data.pre = a;
      } else if (a.type === 'post_assessment') {
        data.post = a;
      }
    });

    // Combine all data
    const result = independentParticipants.map(p => {
      const assessments = assessmentMap.get(p.id) || { pre: null, post: null };
      return {
        id: p.id,
        email: p.email,
        fullName: p.fullName,
        cohortName: p.cohortId ? cohortMap.get(p.cohortId) || null : null,
        organizationName: 'N/A Organization',
        preAssessmentStatus: assessments.pre?.status || null,
        postAssessmentStatus: assessments.post?.status || null,
        preScore: (assessments.pre?.reportData as ReportData)?.totalScore || 0,
        postScore: (assessments.post?.reportData as ReportData)?.totalScore || 0,
      };
    });

    return NextResponse.json({ participants: result });
  } catch (error) {
    console.error('Error fetching independent participants:', error);
    return NextResponse.json(
      { error: 'Failed to fetch independent participants' },
      { status: 500 }
    );
  }
}
