'use server';

import { z } from 'zod';

import { db } from '~/db';
import { attempts, cohorts, participants } from '~/db/schema';

import { actionClient } from '~/lib/action';

import { and, eq } from 'drizzle-orm';

interface ReportData {
  totalScore: number;
}

const printPdfSchema = z.object({
  studentId: z.string().uuid(),
});

// Helper functions from your existing code for grading
const categoryGradingScales = {
  individual: [
    { min: 7, max: 8, grade: 'Exceptional Proficiency' },
    { min: 5, max: 6, grade: 'High Proficiency' },
    { min: 3, max: 4, grade: 'Moderate Proficiency' },
    { min: 1, max: 2, grade: 'Developing Proficiency' },
    { min: 0, max: 1, grade: 'Needs Development' },
  ],
  overall: [
    { min: 36, max: 40, grade: 'Exceptional Proficiency' },
    { min: 30, max: 35, grade: 'High Proficiency' },
    { min: 20, max: 29, grade: 'Moderate Proficiency' },
    { min: 10, max: 19, grade: 'Developing Proficiency' },
    { min: 0, max: 9, grade: 'Needs Development' },
  ],
};

function getGrade(score: number, type: 'individual' | 'overall'): string {
  const scale = categoryGradingScales[type];
  for (const { min, max, grade } of scale) {
    if (score >= min && score <= max) {
      return grade;
    }
  }
  return 'Not Available';
}

export const printPdfAction = actionClient
  .schema(printPdfSchema)
  .action(async ({ parsedInput: { studentId } }) => {
    try {
      // Fetch student data
      const [participant] = await db
        .select({
          id: participants.id,
          email: participants.email,
          fullName: participants.fullName,
          createdAt: participants.createdAt,
          lastActiveAt: participants.lastActiveAt,
          cohortId: participants.cohortId,
          cohortName: cohorts.name,
          stayOut: participants.stayOut,
        })
        .from(participants)
        .leftJoin(cohorts, eq(participants.cohortId, cohorts.id))
        .where(eq(participants.id, studentId));

      if (!participant) {
        return { error: 'Student not found' };
      }

      // Get pre-assessment data
      const [preAssessment] = await db
        .select({
          status: attempts.status,
          reportData: attempts.reportData,
        })
        .from(attempts)
        .where(and(eq(attempts.participantId, studentId), eq(attempts.type, 'pre_assessment')));

      if (!preAssessment?.reportData) {
        return { error: 'No assessment data available' };
      }

      const reportData = preAssessment.reportData as ReportData;

      // Instead of generating PDF on server, return the data and let client handle PDF generation
      return {
        success: true,
        studentData: {
          participant,
          reportData,
          overallGrade: getGrade(reportData.totalScore, 'overall'),
        },
        filename: `${participant.fullName || 'Student'}_Assessment_Report.pdf`,
      };
    } catch (error) {
      console.error('Error fetching data for PDF:', error);
      return {
        error: 'data_fetching_failed',
        message: 'Failed to fetch data for PDF report',
      };
    }
  });
