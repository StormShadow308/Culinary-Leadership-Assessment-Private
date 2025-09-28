import { sendEmail } from './email';

export interface InvitationData {
  participantName: string;
  participantEmail: string;
  organizationName: string;
  cohortName?: string;
  inviteLink: string;
}

export async function sendInvitationEmail(data: InvitationData): Promise<{ success: boolean; error?: string }> {
  try {
    console.log('📧 Sending invitation email to:', data.participantEmail);
    
    const subject = `Invitation to Culinary Leadership Assessment`;
    
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Culinary Leadership Assessment Invitation</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
          }
          .container {
            background-color: #ffffff;
            border-radius: 10px;
            padding: 30px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #e9ecef;
          }
          .logo {
            font-size: 24px;
            font-weight: bold;
            color: #2c3e50;
            margin-bottom: 10px;
          }
          .chef-icon {
            font-size: 32px;
            margin-bottom: 10px;
          }
          .title {
            font-size: 28px;
            font-weight: bold;
            color: #2c3e50;
            margin-bottom: 20px;
          }
          .subtitle {
            font-size: 18px;
            color: #6c757d;
            margin-bottom: 30px;
          }
          .content {
            margin-bottom: 30px;
          }
          .greeting {
            font-size: 18px;
            margin-bottom: 20px;
            color: #2c3e50;
          }
          .message {
            font-size: 16px;
            margin-bottom: 20px;
            line-height: 1.8;
          }
          .details {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #007bff;
          }
          .detail-item {
            margin-bottom: 10px;
            font-size: 16px;
          }
          .detail-label {
            font-weight: bold;
            color: #495057;
          }
          .cta-button {
            display: inline-block;
            background-color: #007bff;
            color: white;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 8px;
            font-size: 18px;
            font-weight: bold;
            text-align: center;
            margin: 20px 0;
            transition: background-color 0.3s ease;
          }
          .cta-button:hover {
            background-color: #0056b3;
          }
          .cta-container {
            text-align: center;
            margin: 30px 0;
          }
          .instructions {
            background-color: #e7f3ff;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #007bff;
          }
          .instruction-title {
            font-weight: bold;
            color: #0056b3;
            margin-bottom: 10px;
          }
          .instruction-list {
            margin: 0;
            padding-left: 20px;
          }
          .instruction-list li {
            margin-bottom: 8px;
            font-size: 15px;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e9ecef;
            color: #6c757d;
            font-size: 14px;
          }
          .footer a {
            color: #007bff;
            text-decoration: none;
          }
          .footer a:hover {
            text-decoration: underline;
          }
          .security-note {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
            color: #856404;
          }
          .security-note-title {
            font-weight: bold;
            margin-bottom: 8px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="chef-icon">👨‍🍳</div>
            <div class="logo">Culinary Leadership Assessment</div>
            <div class="title">You're Invited!</div>
            <div class="subtitle">Complete your culinary leadership assessment</div>
          </div>
          
          <div class="content">
            <div class="greeting">Hello ${data.participantName},</div>
            
            <div class="message">
              You have been invited to participate in the Culinary Leadership Assessment. This comprehensive assessment will help evaluate your leadership skills and potential in the culinary industry.
            </div>
            
            <div class="details">
              <div class="detail-item">
                <span class="detail-label">Participant:</span> ${data.participantName}
              </div>
              <div class="detail-item">
                <span class="detail-label">Email:</span> ${data.participantEmail}
              </div>
              <div class="detail-item">
                <span class="detail-label">Organization:</span> ${data.organizationName}
              </div>
              ${data.cohortName ? `
              <div class="detail-item">
                <span class="detail-label">Cohort:</span> ${data.cohortName}
              </div>
              ` : ''}
            </div>
            
            <div class="cta-container">
              <a href="${data.inviteLink}" class="cta-button">
                🚀 Start Assessment
              </a>
            </div>
            
            <div class="instructions">
              <div class="instruction-title">📋 How to Complete Your Assessment:</div>
              <ol class="instruction-list">
                <li>Click the "Start Assessment" button above</li>
                <li>You'll be redirected to the assessment page</li>
                <li>Complete all sections of the assessment</li>
                <li>Submit your responses when finished</li>
                <li>Your results will be available to your organization</li>
              </ol>
            </div>
            
            <div class="security-note">
              <div class="security-note-title">🔒 Security Notice:</div>
              This invitation link is unique to you and should not be shared with others. If you did not expect this invitation, please contact your organization administrator.
            </div>
            
            <div class="message">
              <strong>Important:</strong> Please complete the assessment within the specified timeframe. If you have any questions or technical issues, contact your organization administrator.
            </div>
          </div>
          
          <div class="footer">
            <p>This invitation was sent by the Culinary Leadership Assessment System.</p>
            <p>If you have any questions, please contact your organization administrator.</p>
            <p><a href="${data.inviteLink}">Direct Link to Assessment</a></p>
          </div>
        </div>
      </body>
      </html>
    `;
    
    const result = await sendEmail({
      to: data.participantEmail,
      subject: subject,
      html: html,
      from: process.env.EMAIL_FROM!
    });
    
    console.log('✅ Invitation email sent successfully to:', data.participantEmail);
    return { success: true };
    
  } catch (error) {
    console.error('❌ Error sending invitation email:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to send invitation email' 
    };
  }
}

export function generateInviteLink(participantEmail: string, organizationId: string, baseUrl: string = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'): string {
  // Create a unique invite link that redirects to assessment with organization context
  const encodedEmail = encodeURIComponent(participantEmail);
  const encodedOrgId = encodeURIComponent(organizationId);
  return `${baseUrl}/assessment?invite=true&email=${encodedEmail}&orgId=${encodedOrgId}`;
}
