'use client';

import { useAction } from 'next-safe-action/hooks';

import { Button } from '@mantine/core';

import { IconPrinter } from '@tabler/icons-react';

import { notifications } from '@mantine/notifications';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

import { printPdfAction } from './print-pdf.action';

// Grade descriptions for the PDF
const gradeDescriptions = {
  'Resilience and Adaptability': {
    'Exceptional Proficiency':
      'Shows advanced adaptability and resilience under pressure. Eﬀective in managing unexpected challenges.',
    'High Proficiency':
      'Demonstrates good resilience with eﬀective approaches to managing stress and adaptability. Minor improvements needed.',
    'Moderate Proficiency':
      'Adequate resilience but shows diﬃculty handling more significant challenges or high-pressure situations.',
    'Developing Proficiency':
      'Struggles with resilience. Requires assistance to manage stress and adapt eﬀectively.',
    'Needs Development': 'Lacks resilience and adaptability. Fails to cope under pressure.',
  },
  'Team Dynamics & Collaboration': {
    'Exceptional Proficiency':
      'Demonstrates excellent teamwork skills and an ability to eﬀectively resolve conflicts.',
    'High Proficiency':
      'Usually eﬀective in collaborating and supporting the team, with minor gaps in team facilitation.',
    'Moderate Proficiency':
      'Shows basic understanding of team collaboration but lacks eﬀectiveness in diﬃcult group situations.',
    'Developing Proficiency':
      'Limited contribution to team collaboration. Often struggles to eﬀectively work within the group.',
    'Needs Development':
      'Lacks basic teamwork and collaborative skills. Does not support the team.',
  },
  'Decision-Making & Problem-Solving': {
    'Exceptional Proficiency': 'Makes eﬀective, strategic decisions in diﬃcult situations.',
    'High Proficiency':
      'Shows generally good decision-making abilities, capable of solving most challenges.',
    'Moderate Proficiency':
      'Displays an adequate understanding of decision-making but lacks strategic eﬀectiveness under pressure.',
    'Developing Proficiency':
      'Struggles to make eﬀective decisions. Needs significant guidance in problem-solving.',
    'Needs Development': 'Does not demonstrate eﬀective problem-solving or decision-making skills.',
  },
  'Self-Awareness & Emotional Intelligence': {
    'Exceptional Proficiency':
      'Displays excellent self-awareness and regulation of emotions, even under stress.',
    'High Proficiency':
      'Understands emotional responses and usually manages emotions well. Minor room for improvement.',
    'Moderate Proficiency':
      'Shows basic emotional understanding but occasionally fails to regulate emotions eﬀectively.',
    'Developing Proficiency':
      'Limited self-awareness. Struggles to regulate emotions in stressful contexts.',
    'Needs Development':
      'Lacks awareness of emotions and their impact. Needs substantial improvement.',
  },
  'Communication & Active Listening': {
    'Exceptional Proficiency':
      'Communicates clearly and eﬀectively, with active listening and empathy consistently demonstrated.',
    'High Proficiency':
      'Generally communicates well and listens eﬀectively but has minor gaps in engagement.',
    'Moderate Proficiency':
      'Adequate communication skills but inconsistencies in listening or conveying messages.',
    'Developing Proficiency':
      'Struggles to communicate clearly or listen actively. Requires coaching to improve.',
    'Needs Development':
      'Lacks basic communication and listening skills. Needs extensive development.',
  },
  Overall: {
    'Exceptional Proficiency': 'Demonstrates advanced leadership skills across all categories.',
    'High Proficiency':
      'Reflects strong leadership performance across key areas with only minor areas needing improvement.',
    'Moderate Proficiency':
      'Shows an acceptable grasp of leadership principles with room for further development.',
    'Developing Proficiency':
      'Indicates significant gaps in understanding and leadership skills that need development.',
    'Needs Development': 'Lacks foundational leadership skills; requires extensive support.',
  },
};

// Helper to get grade color for PDF
function getGradeColorHex(grade: string): string {
  switch (grade) {
    case 'Exceptional Proficiency':
      return '#4caf50';
    case 'High Proficiency':
      return '#009688';
    case 'Moderate Proficiency':
      return '#2196f3';
    case 'Developing Proficiency':
      return '#ff9800';
    case 'Needs Development':
      return '#f44336';
    default:
      return '#757575';
  }
}

// Helper to determine grade based on score
function getGrade(score: number, type: 'individual' | 'overall'): string {
  const scale = categoryGradingScales[type];
  for (const { min, max, grade } of scale) {
    if (score >= min && score <= max) {
      return grade;
    }
  }
  return 'Not Available';
}

// Grading thresholds
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

interface PrintButtonProps {
  studentId: string;
}

export function PrintPdfButton({ studentId }: PrintButtonProps) {
  // Use the useAction hook
  const { executeAsync, isExecuting } = useAction(printPdfAction);

  const generatePDF = async studentData => {
    // Create a hidden div for the PDF content
    const pdfContent = document.createElement('div');
    pdfContent.style.position = 'absolute';
    pdfContent.style.left = '-9999px';
    pdfContent.style.width = '794px'; // A4 width in pixels at 96 DPI

    const { participant, reportData, overallGrade } = studentData;

    pdfContent.innerHTML = `
      <div style="font-family: Arial, sans-serif; margin: 20px; color: #333;">
        <div style="text-align: center; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 1px solid #eee;">
          <h1>Student Assessment Report</h1>
          <p>Generated on ${new Date().toLocaleDateString()}</p>
        </div>
        
        <div style="margin-bottom: 20px; padding: 15px; border: 1px solid #ddd; border-radius: 5px;">
          <h2 style="font-size: 18px; font-weight: bold; margin-bottom: 15px; color: #333;">Student Information</h2>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
            <div>
              <div style="color: #666; font-size: 14px; margin-bottom: 5px;">Name</div>
              <div style="font-weight: 500; margin-bottom: 15px;">${participant.fullName || 'Not provided'}</div>
              
              <div style="color: #666; font-size: 14px; margin-bottom: 5px;">Cohort</div>
              <div style="font-weight: 500; margin-bottom: 15px;">${participant.cohortName || 'No cohort'}</div>
            </div>
            
            <div>
              <div style="color: #666; font-size: 14px; margin-bottom: 5px;">Email</div>
              <div style="font-weight: 500; margin-bottom: 15px;">${participant.email}</div>
              
              <div style="color: #666; font-size: 14px; margin-bottom: 5px;">Status</div>
              <div style="font-weight: 500; margin-bottom: 15px;">
                <span style="display: inline-block; padding: 5px 10px; border-radius: 4px; font-size: 12px; font-weight: bold; color: white; background-color: ${
                  participant.stayOut === 'Stay' ? '#4caf50' : '#f44336'
                };">
                  ${participant.stayOut}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div style="margin-bottom: 20px; padding: 15px; border: 1px solid #ddd; border-radius: 5px;">
          <h2 style="font-size: 18px; font-weight: bold; margin-bottom: 15px; color: #333;">Summary</h2>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <thead>
              <tr style="background-color: #14162b; color: white;">
                <th style="padding: 10px; text-align: left;">Overall Score</th>
                <th style="padding: 10px; text-align: center;">${reportData.totalScore} out of ${reportData.totalPossible}</th>
                <th style="padding: 10px; text-align: right;">${overallGrade}</th>
              </tr>
            </thead>
            <tbody>
              ${reportData.categoryResults
                .map(
                  category => `
                <tr style="${category.score === 0 ? 'background-color: #fff9c4;' : ''}">
                  <td style="padding: 10px; text-align: left; border-bottom: 1px solid #eee;">${category.category}</td>
                  <td style="padding: 10px; text-align: center; border-bottom: 1px solid #eee;">${category.score} out of ${category.total}</td>
                  <td style="padding: 10px; text-align: right; border-bottom: 1px solid #eee;">${getGrade(category.score, 'individual')}</td>
                </tr>
              `
                )
                .join('')}
            </tbody>
          </table>
        </div>
        
        <div style="margin-bottom: 20px; padding: 15px; border: 1px solid #ddd; border-radius: 5px;">
          <h2 style="font-size: 18px; font-weight: bold; margin-bottom: 15px; color: #333;">Details</h2>
          <h3 style="margin-bottom: 10px;">${participant.fullName}: ${reportData.totalScore} out of ${reportData.totalPossible} - ${overallGrade}</h3>
          <p style="margin-bottom: 20px; line-height: 1.5;">${gradeDescriptions['Overall'][overallGrade]}</p>
          
          ${reportData.categoryResults
            .map(category => {
              const grade = getGrade(category.score, 'individual');
              const description = gradeDescriptions[category.category]?.[grade] || '';

              return `
              <div style="margin-bottom: 20px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                  <h4 style="margin: 0;">${category.category}</h4>
                  <span style="color: ${getGradeColorHex(grade)};">
                    ${category.score} out of ${category.total} - ${grade}
                  </span>
                </div>
                <p style="margin-bottom: 15px; line-height: 1.5;">${description}</p>
                <div style="height: 1px; background-color: #eee; margin: 15px 0;"></div>
              </div>
            `;
            })
            .join('')}
        </div>
      </div>
    `;

    document.body.appendChild(pdfContent);

    try {
      const canvas = await html2canvas(pdfContent);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 0;

      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);

      pdf.save(`${participant.fullName || 'Student'}_Assessment_Report.pdf`);

      notifications.show({
        color: 'green',
        title: 'Success',
        message: 'PDF report generated successfully',
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      notifications.show({
        color: 'red',
        title: 'Error',
        message: 'Failed to generate PDF',
      });
    } finally {
      // Clean up
      document.body.removeChild(pdfContent);
    }
  };

  const handlePrintPdf = async () => {
    try {
      const result = await executeAsync({ studentId });

      if (result.serverError || result.validationErrors) {
        notifications.show({
          color: 'red',
          title: 'Error',
          message: 'Failed to fetch data for PDF',
        });
        return;
      }

      if (result.data?.error) {
        notifications.show({
          color: 'red',
          title: 'Error',
          message: result.data.message || 'Failed to fetch data for PDF',
        });
        return;
      }

      if (result.data?.success && result.data.studentData) {
        // Generate PDF on the client side
        await generatePDF(result.data.studentData);
      }
    } catch (error) {
      console.error('Error handling PDF generation:', error);
      notifications.show({
        color: 'red',
        title: 'Error',
        message: 'An unexpected error occurred',
      });
    }
  };

  return (
    <Button
      leftSection={<IconPrinter size={16} />}
      onClick={handlePrintPdf}
      loading={isExecuting}
      variant="outline"
    >
      Print PDF
    </Button>
  );
}
