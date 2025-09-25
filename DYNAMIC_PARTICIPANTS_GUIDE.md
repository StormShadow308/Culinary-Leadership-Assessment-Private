# 👥 Dynamic Participants System Guide

This guide explains how the dynamic participant system works, ensuring that participants are handled dynamically with personalized experiences.

## 🎯 Overview

The system now supports **fully dynamic participants** with:
- **Dynamic participant creation** with real-time data
- **Personalized invite links** for each participant
- **Dynamic data fetching** for participant information
- **Customized welcome messages** with participant details
- **Real-time organization and cohort information**

## ✅ Dynamic Features Implemented

### **1. Dynamic Participant Creation**
- **Real-time creation** in admin dashboard
- **Automatic email invitations** sent immediately
- **Unique invite links** generated for each participant
- **Organization and cohort association** handled dynamically

### **2. Dynamic Data Fetching**
- **Participant info API** (`/api/participant-info`) for real-time data
- **Organization and cohort details** fetched dynamically
- **Personalized welcome messages** with participant information
- **Real-time data updates** without page refresh

### **3. Dynamic Invite Links**
- **Unique links per participant** with email parameter
- **Dynamic participant lookup** when clicking invite links
- **Personalized welcome messages** with participant details
- **Organization and cohort information** displayed dynamically

## 🔧 Technical Implementation

### **Dynamic Participant API**
```typescript
// GET /api/participant-info?email=participant@example.com
export async function GET(request: NextRequest) {
  const email = searchParams.get('email');
  
  // Fetch participant with organization and cohort info
  const participantData = await db.execute(sql`
    SELECT 
      p.id, p.full_name, p.email, p.organization_id, p.cohort_id,
      o.name as organization_name,
      c.name as cohort_name
    FROM participants p
    LEFT JOIN organization o ON p.organization_id = o.id
    LEFT JOIN cohorts c ON p.cohort_id = c.id
    WHERE p.email = ${email}
  `);
  
  return NextResponse.json({ participant: participantData.rows[0] });
}
```

### **Dynamic Invite Link Generation**
```typescript
export function generateInviteLink(participantEmail: string): string {
  const encodedEmail = encodeURIComponent(participantEmail);
  return `${baseUrl}/assessment?invite=true&email=${encodedEmail}`;
}
```

### **Dynamic Welcome Component**
```typescript
export function InviteWelcome({ participantName, participantEmail, isInvite }) {
  const [participant, setParticipant] = useState<Participant | null>(null);
  
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get('email');
    
    if (email) {
      fetchParticipantData(email); // Dynamic data fetching
    }
  }, []);
  
  const fetchParticipantData = async (email: string) => {
    const response = await fetch(`/api/participant-info?email=${email}`);
    const data = await response.json();
    setParticipant(data.participant);
  };
}
```

## 📊 Dynamic Data Flow

### **1. Admin Creates Participant**
```
Admin Dashboard → Add Participant → Fill Form → Submit
```

### **2. System Processes Dynamically**
```
Create in Database → Generate Unique Link → Send Email → Log Success
```

### **3. Participant Receives Email**
```
Professional Email → Personalized Content → Unique Invite Link → Call-to-Action
```

### **4. Participant Clicks Link**
```
Invite Link → Dynamic Lookup → Personalized Welcome → Assessment Form
```

### **5. Dynamic Welcome Message**
```
Participant Data → Organization Info → Cohort Info → Personalized Message
```

## 🎯 Dynamic Features

### **✅ Dynamic Participant Creation**
- **Real-time creation** in admin dashboard
- **Immediate email sending** with personalized content
- **Unique invite links** for each participant
- **Organization and cohort association** handled automatically

### **✅ Dynamic Data Fetching**
- **Real-time participant lookup** by email
- **Organization and cohort information** fetched dynamically
- **Personalized welcome messages** with participant details
- **No page refresh required** for data updates

### **✅ Dynamic Invite Links**
- **Unique links per participant** with email parameter
- **Dynamic participant validation** when accessing links
- **Personalized welcome messages** with participant information
- **Organization and cohort details** displayed dynamically

### **✅ Dynamic Welcome Messages**
- **Participant name** displayed dynamically
- **Email address** shown for verification
- **Organization name** included if available
- **Cohort information** displayed if assigned
- **Personalized instructions** for each participant

## 📧 Dynamic Email Features

### **Personalized Email Content**
- **Participant name** in greeting
- **Organization information** included
- **Cohort details** if assigned
- **Unique invite link** for each participant
- **Professional HTML template** with dynamic content

### **Dynamic Email Template**
```html
<h1>Hello {{participantName}}!</h1>
<p>You've been invited to participate in the Culinary Leadership Assessment.</p>

<div class="details">
  <p><strong>Participant:</strong> {{participantName}}</p>
  <p><strong>Email:</strong> {{participantEmail}}</p>
  <p><strong>Organization:</strong> {{organizationName}}</p>
  <p><strong>Cohort:</strong> {{cohortName}}</p>
</div>

<a href="{{inviteLink}}" class="cta-button">Start Assessment</a>
```

## 🔗 Dynamic Invite Link System

### **Link Format**
```
https://yourdomain.com/assessment?invite=true&email=participant@example.com
```

### **Dynamic Processing**
1. **Email parameter** extracted from URL
2. **Participant data** fetched dynamically
3. **Welcome message** personalized with participant info
4. **Organization and cohort** details displayed
5. **Assessment form** pre-filled with participant data

### **Dynamic Welcome Message**
- **Participant name** from database
- **Email address** for verification
- **Organization name** if available
- **Cohort information** if assigned
- **Personalized instructions** for assessment

## 🎯 Benefits of Dynamic System

### **For Administrators**
- **Real-time participant creation** without delays
- **Automatic email invitations** sent immediately
- **Dynamic data updates** without manual intervention
- **Personalized experience** for each participant

### **For Participants**
- **Personalized welcome messages** with their information
- **Organization and cohort details** clearly displayed
- **Unique invite links** that work immediately
- **Professional email experience** with dynamic content

### **For System Performance**
- **Dynamic data fetching** reduces server load
- **Real-time updates** without page refreshes
- **Efficient database queries** with proper indexing
- **Scalable architecture** for multiple participants

## 📊 Dynamic Data Examples

### **Participant 1: With Cohort**
```json
{
  "id": "participant-1",
  "fullName": "John Smith",
  "email": "john.smith@example.com",
  "organizationName": "Culinary Leadership Academy",
  "cohortName": "Fall 2024 Leadership Cohort"
}
```

### **Participant 2: Without Cohort**
```json
{
  "id": "participant-2",
  "fullName": "Sarah Johnson",
  "email": "sarah.johnson@example.com",
  "organizationName": "Culinary Leadership Academy",
  "cohortName": null
}
```

### **Dynamic Welcome Messages**
- **John Smith**: Shows organization and cohort information
- **Sarah Johnson**: Shows organization only (no cohort)
- **Michael Brown**: Shows basic participant information

## 🔍 Dynamic System Testing

### **Test Scenarios**
1. **Create multiple participants** with different data
2. **Verify unique invite links** for each participant
3. **Test dynamic data fetching** for participant info
4. **Check personalized welcome messages**
5. **Verify organization and cohort display**

### **Expected Results**
- ✅ **Each participant gets unique invite link**
- ✅ **Participant data fetched dynamically**
- ✅ **Welcome messages personalized**
- ✅ **Organization and cohort info displayed**
- ✅ **System handles different participant types**

## 🎉 Dynamic System Benefits

### **✅ Real-Time Updates**
- **Immediate participant creation** in admin dashboard
- **Automatic email sending** with personalized content
- **Dynamic data fetching** for participant information
- **Real-time welcome messages** with participant details

### **✅ Personalized Experience**
- **Unique invite links** for each participant
- **Personalized welcome messages** with participant info
- **Organization and cohort details** displayed dynamically
- **Customized email content** for each participant

### **✅ Scalable Architecture**
- **Dynamic data handling** for multiple participants
- **Efficient database queries** with proper indexing
- **Real-time updates** without performance issues
- **Flexible system** that adapts to different participant types

---

**🎯 Result**: The participant system is now fully dynamic! Each participant gets a personalized experience with unique invite links, dynamic data fetching, and customized welcome messages that adapt to their specific information and organization details.
