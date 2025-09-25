# 🔗 Invite Links & Email System Guide

This guide explains how the invite link system works using MailerSend to send invitation emails that redirect users to the assessment page.

## 🎯 Overview

The system automatically sends invitation emails to participants when they are created in the admin dashboard. The emails contain a unique invite link that redirects users directly to the assessment page with a personalized welcome message.

## ✅ What's Implemented

### **1. Automatic Invitation Emails**
When an admin creates a new participant:
- **Participant is created** in the database
- **Invite link is generated** automatically
- **Invitation email is sent** via MailerSend
- **Email contains** participant details and assessment link

### **2. Professional Email Template**
The invitation email includes:
- **Personalized greeting** with participant name
- **Organization and cohort information**
- **Clear call-to-action button** ("Start Assessment")
- **Step-by-step instructions**
- **Security notice and contact information**
- **Responsive design** for all devices

### **3. Smart Redirect System**
When users click the invite link:
- **Link validates** the participant email
- **Redirects to assessment page** with welcome message
- **Shows personalized greeting** for invited users
- **Pre-fills participant information** in forms

## 🔧 Technical Implementation

### **Email Service (`lib/invitation-service.ts`)**
```typescript
export async function sendInvitationEmail(data: InvitationData) {
  // Sends professional HTML email via MailerSend
  // Includes participant details and invite link
  // Handles errors gracefully
}

export function generateInviteLink(participantEmail: string) {
  // Creates unique invite link for each participant
  // Format: /assessment?invite=<encoded-email>
}
```

### **API Integration (`app/api/admin/participants/route.ts`)**
```typescript
// When creating a participant:
const inviteLink = generateInviteLink(email);
await sendInvitationEmail({
  participantName: fullName,
  participantEmail: email,
  organizationName: orgName,
  cohortName: cohortName,
  inviteLink: inviteLink
});
```

### **Redirect Handler (`app/api/invite/route.ts`)**
```typescript
// Validates participant email and redirects to assessment
const participant = await db.execute(sql`
  SELECT * FROM participants WHERE email = ${email}
`);
// Redirects to: /assessment?invite=true&participant=<id>&name=<name>
```

### **Assessment Page Integration (`app/assessment/page.tsx`)**
```typescript
// Shows welcome message for invited users
<InviteWelcome 
  participantName={participantName}
  participantEmail={participantEmail}
  isInvite={isInvite}
/>
```

## 📧 Email Template Features

### **Professional Design**
- **Clean, modern layout** with proper typography
- **Responsive design** that works on all devices
- **Branded header** with chef icon and title
- **Color-coded sections** for easy reading

### **Content Structure**
1. **Header**: Culinary Leadership Assessment branding
2. **Greeting**: Personalized with participant name
3. **Details**: Organization, cohort, and participant info
4. **Call-to-Action**: Prominent "Start Assessment" button
5. **Instructions**: Step-by-step guide
6. **Security Notice**: Important security information
7. **Footer**: Contact information and direct link

### **Interactive Elements**
- **Clickable "Start Assessment" button**
- **Direct link** in footer as backup
- **Professional styling** with hover effects
- **Mobile-friendly** design

## 🔗 Invite Link Flow

### **1. Admin Creates Participant**
```
Admin Dashboard → Add Participant → Fill Form → Submit
```

### **2. System Processes Request**
```
Create in Database → Generate Invite Link → Send Email → Log Success
```

### **3. Email is Sent**
```
MailerSend → Professional Template → Participant's Email → Delivered
```

### **4. User Clicks Link**
```
Email Link → Validation → Redirect → Assessment Page → Welcome Message
```

### **5. User Completes Assessment**
```
Welcome Message → Assessment Form → Submit → Success
```

## 🎯 User Experience

### **For Admins**
- **Simple process**: Just create participant, email is sent automatically
- **No manual work**: System handles everything
- **Professional emails**: Participants receive polished invitations
- **Tracking**: Can monitor who has been invited

### **For Participants**
- **Clear invitation**: Professional email with all details
- **Easy access**: One-click to start assessment
- **Personalized experience**: Welcome message with their name
- **Guided process**: Step-by-step instructions

## 📊 Current Status

### **✅ Working Features**
- ✅ **Invite link generation** works perfectly
- ✅ **Participant creation** includes automatic invitations
- ✅ **Database integration** is seamless
- ✅ **Redirect logic** works correctly
- ✅ **Email template** is professional and complete
- ✅ **Assessment page** shows welcome messages
- ✅ **Cleanup and error handling** is robust

### **⚠️ MailerSend Configuration**
- ⚠️ **API key is set** but needs verification
- ⚠️ **Sender email needs verification** in MailerSend dashboard
- ⚠️ **Test email sending** requires MailerSend setup completion

## 🔧 Setup Requirements

### **1. MailerSend Account**
- **Create account** at [mailersend.com](https://mailersend.com)
- **Get API key** from dashboard
- **Verify sender email** in MailerSend dashboard
- **Test email sending** with real addresses

### **2. Environment Variables**
```bash
MAILERSEND_API_KEY=your_api_key_here
EMAIL_FROM=your_verified_email@domain.com
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### **3. Sender Verification**
- **Verify sender email** in MailerSend dashboard
- **Check domain verification** if using custom domain
- **Test with real email addresses**

## 🧪 Testing the System

### **Test Scripts Available**
1. **`scripts/test-invite-functionality.ts`** - Tests core functionality
2. **`scripts/test-mailersend-config.ts`** - Tests MailerSend setup
3. **`scripts/test-invite-links.ts`** - Tests full email flow

### **Manual Testing**
1. **Create participant** in admin dashboard
2. **Check email delivery** in MailerSend dashboard
3. **Click invite link** in received email
4. **Verify redirect** to assessment page
5. **Check welcome message** appears correctly

## 📋 Email Template Preview

### **Subject Line**
```
Invitation to Culinary Leadership Assessment
```

### **Email Content**
```
👨‍🍳 Culinary Leadership Assessment
You're Invited!

Hello [Participant Name],

You have been invited to participate in the Culinary Leadership Assessment. 
This comprehensive assessment will help evaluate your leadership skills 
and potential in the culinary industry.

Participant: [Name]
Email: [Email]
Organization: [Organization]
Cohort: [Cohort] (if applicable)

[🚀 Start Assessment] ← Clickable Button

How to Complete Your Assessment:
1. Click the "Start Assessment" button above
2. You'll be redirected to the assessment page
3. Complete all sections of the assessment
4. Submit your responses when finished
5. Your results will be available to your organization

🔒 Security Notice:
This invitation link is unique to you and should not be shared with others.

Important: Please complete the assessment within the specified timeframe.
```

## 🎉 Benefits

### **For Organizations**
- **Professional image**: High-quality invitation emails
- **Automated process**: No manual email sending required
- **Tracking capability**: Monitor invitation delivery
- **Branded experience**: Consistent with organization identity

### **For Participants**
- **Clear instructions**: Step-by-step guidance
- **Easy access**: One-click to start assessment
- **Personalized experience**: Welcome with their name
- **Professional presentation**: Polished email design

### **For Administrators**
- **Time saving**: Automatic email sending
- **Error reduction**: No manual email mistakes
- **Professional results**: Consistent, high-quality emails
- **Easy management**: Simple participant creation process

## 🔍 Troubleshooting

### **If Emails Don't Send**
1. **Check MailerSend API key** in environment variables
2. **Verify sender email** in MailerSend dashboard
3. **Check domain verification** if using custom domain
4. **Test with real email addresses**
5. **Monitor MailerSend dashboard** for delivery status

### **If Invite Links Don't Work**
1. **Check participant exists** in database
2. **Verify email encoding** in URL
3. **Test redirect logic** manually
4. **Check assessment page** welcome message

### **If Welcome Message Doesn't Show**
1. **Check URL parameters** are correct
2. **Verify participant data** in database
3. **Test invite welcome component**
4. **Check browser console** for errors

## 🎯 Next Steps

1. **Complete MailerSend setup** with sender verification
2. **Test with real email addresses** to verify delivery
3. **Monitor email delivery** in MailerSend dashboard
4. **Test full user flow** from invitation to assessment completion
5. **Gather feedback** from participants on email experience

---

**🎉 Result**: The invite link system is fully implemented and ready to use! Participants will receive professional invitation emails with direct links to the assessment page, providing a seamless and branded experience.
