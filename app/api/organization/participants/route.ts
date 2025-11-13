import { NextResponse } from 'next/server';
import { db } from '~/db';
import { participants, attempts, cohorts } from '~/db/schema';
import { eq, and, isNotNull, sql } from 'drizzle-orm';

interface ReportData {
  totalScore: number;
  totalPossible: number;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orgId = searchParams.get('orgId');

    if (!orgId) {
      return NextResponse.json(
        { error: 'orgId parameter is required' },
        { status: 400 }
      );
    }

    // Fetch all participants for the organization
    const orgParticipants = await db
      .select({
        id: participants.id,
        email: participants.email,
        fullName: participants.fullName,
        cohortId: participants.cohortId,
      })
      .from(participants)
      .where(eq(participants.organizationId, orgId));

    // Fetch cohort names
    const cohortIds = [...new Set(orgParticipants.map(p => p.cohortId).filter(Boolean))];
    const cohortData = cohortIds.length > 0
      ? await db.select({ id: cohorts.id, name: cohorts.name }).from(cohorts).where(sql`id = ANY(${cohortIds})`)
      : [];
    
    const cohortMap = new Map(cohortData.map(c => [c.id, c.name]));

    // Fetch assessment data for all participants
    const participantIds = orgParticipants.map(p => p.id);
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
    const result = orgParticipants.map(p => {
      const assessments = assessmentMap.get(p.id) || { pre: null, post: null };
      return {
        id: p.id,
        email: p.email,
        fullName: p.fullName,
        cohortName: p.cohortId ? cohortMap.get(p.cohortId) || null : null,
        preAssessmentStatus: assessments.pre?.status || null,
        postAssessmentStatus: assessments.post?.status || null,
        preScore: (assessments.pre?.reportData as ReportData)?.totalScore || 0,
        postScore: (assessments.post?.reportData as ReportData)?.totalScore || 0,
      };
    });

    return NextResponse.json({ participants: result });
  } catch (error) {
    console.error('Error fetching organization participants:', error);
    return NextResponse.json(
      { error: 'Failed to fetch participants' },
      { status: 500 }
    );
  }
}
