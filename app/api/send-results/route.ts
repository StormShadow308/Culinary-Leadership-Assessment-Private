import { NextResponse } from 'next/server';
import { db } from '~/db';
import { participants, attempts } from '~/db/schema';
import { eq, and, isNotNull, sql } from 'drizzle-orm';
import { sendEmail } from '~/lib/email';

interface ReportData {
  totalScore: number;
  totalPossible: number;
  categoryResults?: Array<{
    category: string;
    score: number;
    total: number;
  }>;
}

export async function POST(request: Request) {
  try {
    const { participantIds } = await request.json();

    if (!participantIds || !Array.isArray(participantIds) || participantIds.length === 0) {
      return NextResponse.json(
        { error: 'participantIds array is required' },
        { status: 400 }
      );
    }

    const results = [];
    const errors = [];

    for (const participantId of participantIds) {
      try {
        // Fetch participant details with relations
        const participantData = await db
          .select({
            id: participants.id,
            email: participants.email,
            fullName: participants.fullName,
            cohortId: participants.cohortId,
            organizationId: participants.organizationId,
          })
          .from(participants)
          .where(eq(participants.id, participantId))
          .limit(1);

        if (!participantData || participantData.length === 0) {
          errors.push({ participantId, error: 'Participant not found' });
          continue;
        }

        const participant = participantData[0];

        // Fetch cohort and organization names
        const cohortName = participant.cohortId
          ? await db.execute(sql`SELECT name FROM cohorts WHERE id = ${participant.cohortId}`)
          : null;
        const orgName = participant.organizationId
          ? await db.execute(sql`SELECT name FROM organization WHERE id = ${participant.organizationId}`)
          : null;

        // Fetch participant's completed attempts with report data
        const completedAttempts = await db
          .select({
            id: attempts.id,
            type: attempts.type,
            completedAt: attempts.completedAt,
            reportData: sql<ReportData>`report_data`,
          })
          .from(attempts)
          .where(
            and(
              eq(attempts.participantId, participantId),
              isNotNull(attempts.completedAt)
            )
          )
          .orderBy(attempts.completedAt);

        if (completedAttempts.length === 0) {
          errors.push({ participantId, error: 'No completed assessments found' });
          continue;
        }

        // Calculate scores from report data
        const preAssessment = completedAttempts.find(a => a.type === 'pre_assessment');
        const postAssessment = completedAttempts.find(a => a.type === 'post_assessment');

        const preScore = (preAssessment?.reportData as ReportData)?.totalScore || 0;
        const postScore = (postAssessment?.reportData as ReportData)?.totalScore || 0;
        const maxScore = (preAssessment?.reportData as ReportData)?.totalPossible || 40;

        // Extract organization and cohort names from query results
        const organizationName = orgName && orgName.rows.length > 0 
          ? (orgName.rows[0] as any).name 
          : 'N/A Organization';
        const cohortNameStr = cohortName && cohortName.rows.length > 0 
          ? (cohortName.rows[0] as any).name 
          : 'Independent';

        // Generate email content
        const emailHtml = generateResultsEmail({
          participantName: participant.fullName || participant.email.split('@')[0],
          organizationName,
          cohortName: cohortNameStr,
          preScore,
          postScore,
          maxScore,
          hasPreAssessment: !!preAssessment,
          hasPostAssessment: !!postAssessment,
        });

        // Send email
        await sendEmail({
          to: participant.email,
          subject: 'Your Culinary Leadership Assessment Results',
          html: emailHtml,
        });

        results.push({
          participantId,
          email: participant.email,
          success: true,
        });
      } catch (error) {
        console.error(`Error sending results to participant ${participantId}:`, error);
        errors.push({
          participantId,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return NextResponse.json({
      success: true,
      results,
      errors,
      summary: {
        total: participantIds.length,
        sent: results.length,
        failed: errors.length,
      },
    });
  } catch (error) {
    console.error('Error in send-results API:', error);
    return NextResponse.json(
      { error: 'Failed to send results' },
      { status: 500 }
    );
  }
}

interface EmailData {
  participantName: string;
  organizationName: string;
  cohortName: string;
  preScore: number;
  postScore: number;
  maxScore: number;
  hasPreAssessment: boolean;
  hasPostAssessment: boolean;
}

function generateResultsEmail(data: EmailData): string {
  const {
    participantName,
    organizationName,
    cohortName,
    preScore,
    postScore,
    maxScore,
    hasPreAssessment,
    hasPostAssessment,
  } = data;

  const improvement = postScore - preScore;
  const improvementPercent = preScore > 0 ? Math.round((improvement / preScore) * 100) : 0;
  const postPercentage = Math.round((postScore / maxScore) * 100);

  let performanceMessage = '';
  if (postScore >= maxScore * 0.875) {
    performanceMessage = '🌟 Outstanding Performance! You\'ve demonstrated exceptional leadership skills.';
  } else if (postScore >= maxScore * 0.7) {
    performanceMessage = '👏 Excellent Progress! You\'ve shown strong leadership capabilities.';
  } else if (postScore >= maxScore * 0.525) {
    performanceMessage = '✨ Good Development! You\'re making solid progress in your leadership journey.';
  } else {
    performanceMessage = '💪 Keep Growing! You\'ve taken important first steps in developing your leadership skills.';
  }

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Assessment Results</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #f7f7f8;
      margin: 0;
      padding: 24px;
      color: #111827;
    }
    .card {
      max-width: 640px;
      margin: 0 auto;
      background: #ffffff;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      overflow: hidden;
    }
    .header {
      background: #f97316;
      color: #fff;
      padding: 24px;
      text-align: center;
    }
    .content {
      padding: 24px;
    }
    .score-box {
      background: #fef3c7;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
      text-align: center;
    }
    .score-large {
      font-size: 32px;
      font-weight: 700;
      color: #f97316;
    }
    .progress-bar {
      height: 12px;
      background: #e5e7eb;
      border-radius: 9999px;
      overflow: hidden;
      margin: 16px 0;
    }
    .progress-fill {
      height: 12px;
      background: #f97316;
      transition: width 0.3s ease;
    }
    .info-box {
      background: #e0f2fe;
      padding: 16px;
      border-radius: 8px;
      margin: 16px 0;
      border-left: 4px solid #0ea5e9;
    }
    .improvement-badge {
      display: inline-block;
      padding: 4px 12px;
      background: #10b981;
      color: #fff;
      border-radius: 16px;
      font-size: 14px;
      font-weight: 600;
      margin-left: 8px;
    }
    .performance-msg {
      font-size: 16px;
      font-weight: 600;
      color: #f97316;
      margin: 16px 0;
      padding: 16px;
      background: #fff7ed;
      border-radius: 8px;
      text-align: center;
    }
    .footer {
      text-align: center;
      color: #6b7280;
      font-size: 14px;
      margin-top: 16px;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <div style="font-size: 24px; font-weight: 700; margin-bottom: 8px;">
        👨‍🍳 Culinary Leadership Assessment
      </div>
      <div style="opacity: 0.9; font-size: 16px;">Your Assessment Results</div>
    </div>
    <div class="content">
      <p style="font-size: 18px; margin-bottom: 8px;">Hi ${participantName},</p>
      <p>
        Thank you for completing the Culinary Leadership Assessment with 
        <strong>${organizationName}</strong> (${cohortName}).
      </p>
      
      ${hasPreAssessment && hasPostAssessment ? `
      <div class="info-box">
        <div style="font-weight: 600; margin-bottom: 8px;">📊 Assessment Progress</div>
        <div style="display: flex; justify-content: space-around; text-align: center;">
          <div>
            <div style="color: #6b7280;">Pre-Assessment</div>
            <div style="font-size: 24px; font-weight: 700; color: #6b7280;">
              ${preScore}/${maxScore}
            </div>
          </div>
          <div style="font-size: 32px; color: #f97316;">→</div>
          <div>
            <div style="color: #6b7280;">Post-Assessment</div>
            <div style="font-size: 24px; font-weight: 700; color: #f97316;">
              ${postScore}/${maxScore}
            </div>
          </div>
        </div>
        ${improvement > 0 ? `
        <div style="text-align: center; margin-top: 12px;">
          <span class="improvement-badge">
            +${improvement} points (${improvementPercent}% improvement) 🎉
          </span>
        </div>
        ` : ''}
      </div>
      ` : `
      <div class="score-box">
        <div class="score-large">${postScore} / ${maxScore}</div>
        <div style="color: #6b7280; font-size: 16px; margin-top: 8px;">
          (${postPercentage}%)
        </div>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" style="width: ${postPercentage}%"></div>
      </div>
      `}
      
      <div class="performance-msg">${performanceMessage}</div>
      
      <div style="margin: 24px 0; padding: 16px; background: #fef3c7; border-radius: 8px;">
        <div style="font-weight: 600; margin-bottom: 8px;">🎯 Next Steps</div>
        <ul style="margin: 8px 0; padding-left: 20px; line-height: 1.8;">
          <li>Review your scores to identify strengths and areas for growth</li>
          <li>Discuss your results with your mentor or supervisor</li>
          <li>Set specific goals for continued leadership development</li>
          <li>Apply your learnings in real-world culinary leadership situations</li>
        </ul>
      </div>
      
      <p style="color: #6b7280; margin-top: 20px;">
        If you have any questions about your results, please contact your organization 
        administrator or reply to this email.
      </p>
    </div>
  </div>
  <div class="footer">
    Sent by Culinary Leadership Assessment System • ${organizationName}<br/>
    This email contains confidential assessment results
  </div>
</body>
</html>
  `;
}
