# 🧪 Culinary Leadership Assessment - Testing Guide

## 📋 Overview
This guide covers all the different ways to test the culinary leadership assessment platform.

## 🚀 Quick Start Testing

### 1. **Development Server**
```bash
# Start the development server
npm run dev
# or
pnpm dev
```
- **URL**: http://localhost:3000
- **Features**: Hot reload, Turbopack for fast builds

### 2. **Database Testing**
```bash
# Start database
npm run db:start

# View database in browser
npm run db:studio

# Reset database (if needed)
npm run db:reset
```

## 🔍 Manual Testing Scenarios

### **User Authentication Testing**

#### **1. Admin User Testing**
- **Login**: Use `admin@example.com` with your admin password
- **Expected**: Access to admin dashboard, user management, organization management
- **Test Actions**:
  - View all users
  - Manage user roles
  - View organization analytics
  - Access admin-only features

#### **2. Student User Testing**
- **Login**: Use student credentials (e.g., `huzaifataimoor308@gmail.com`)
- **Expected**: Access to assessment features only
- **Test Actions**:
  - Take assessments
  - View assessment results
  - Navigate assessment flow

#### **3. Organization User Testing**
- **Login**: Use organization credentials
- **Expected**: Access to organization dashboard and analytics
- **Test Actions**:
  - View organization dashboard
  - Check analytics and charts
  - Manage participants
  - View assessment results

### **Assessment Flow Testing**

#### **1. Assessment Creation**
- **Path**: `/assessment`
- **Test Steps**:
  1. Create new assessment
  2. Fill in assessment details
  3. Submit assessment
  4. Verify assessment is created

#### **2. Assessment Taking**
- **Path**: `/attempt/[attemptId]`
- **Test Steps**:
  1. Start assessment
  2. Answer questions (best/worst options)
  3. Navigate between questions
  4. Submit assessment
  5. View results

#### **3. Assessment Results**
- **Path**: `/attempt/[attemptId]/results`
- **Test Steps**:
  1. View score breakdown
  2. Check category scores
  3. Verify proficiency levels
  4. Test PDF export (if available)

### **Dashboard Testing**

#### **1. Organization Dashboard**
- **Path**: `/organisation`
- **Test Features**:
  - Total respondents count
  - Average score calculation
  - Completion rate
  - Proficiency levels chart
  - Skill set score chart
  - Cohort scoring curve
  - Top performing respondents

#### **2. Admin Dashboard**
- **Path**: `/admin`
- **Test Features**:
  - User management
  - Organization management
  - System analytics
  - Role management

### **Data Management Testing**

#### **1. Participant Management**
- **Path**: `/organisation/respondents`
- **Test Actions**:
  - View all participants
  - Filter by cohort
  - Update participant status
  - Invite new students

#### **2. Cohort Management**
- **Path**: `/organisation/new`
- **Test Actions**:
  - Create new cohorts
  - Assign participants to cohorts
  - View cohort analytics

## 🛠️ Automated Testing Setup

### **1. Install Testing Dependencies**
```bash
# Install testing libraries
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
npm install --save-dev @types/jest
```

### **2. Create Test Configuration**
Create `jest.config.js`:
```javascript
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  testEnvironment: 'jest-environment-jsdom',
}

module.exports = createJestConfig(customJestConfig)
```

### **3. Create Test Setup File**
Create `jest.setup.js`:
```javascript
import '@testing-library/jest-dom'
```

### **4. Add Test Scripts to package.json**
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

## 📊 Database Testing

### **1. Database State Verification**
```bash
# Check database connection
npm run db:studio

# Verify tables and data
# Check: users, participants, organizations, cohorts, attempts
```

### **2. Data Integrity Testing**
- Verify foreign key relationships
- Check data constraints
- Test cascade deletions
- Validate data types

## 🔧 API Testing

### **1. Authentication Endpoints**
- `POST /api/auth/signin`
- `POST /api/auth/signup`
- `POST /api/auth/signout`

### **2. Assessment Endpoints**
- `GET /api/assessment/questions`
- `POST /api/assessment/answer`
- `POST /api/assessment/complete`

### **3. Organization Endpoints**
- `GET /api/organisation/analytics`
- `GET /api/organisation/participants`

## 🎯 Performance Testing

### **1. Load Testing**
```bash
# Install artillery for load testing
npm install -g artillery

# Create load test script
# Test concurrent users, response times
```

### **2. Database Performance**
- Test with large datasets
- Monitor query performance
- Check index usage

## 🐛 Error Testing

### **1. Invalid Input Testing**
- Test with invalid email formats
- Test with missing required fields
- Test with invalid UUIDs
- Test with out-of-range values

### **2. Authentication Error Testing**
- Test with invalid credentials
- Test with expired sessions
- Test with insufficient permissions

### **3. Database Error Testing**
- Test with connection failures
- Test with constraint violations
- Test with foreign key errors

## 📱 Browser Testing

### **1. Cross-Browser Testing**
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

### **2. Responsive Testing**
- Desktop (1920x1080)
- Tablet (768x1024)
- Mobile (375x667)

## 🔒 Security Testing

### **1. Authentication Security**
- Test session management
- Test role-based access control
- Test password requirements

### **2. Data Security**
- Test SQL injection prevention
- Test XSS prevention
- Test CSRF protection

## 📈 Monitoring and Logging

### **1. Application Logs**
- Check console logs for errors
- Monitor API response times
- Track user actions

### **2. Database Monitoring**
- Monitor query performance
- Check connection pools
- Track slow queries

## 🚀 Production Testing

### **1. Build Testing**
```bash
# Test production build
npm run build
npm run start
```

### **2. Environment Testing**
- Test with production environment variables
- Test with production database
- Test with production email service

## 📝 Test Checklist

### **✅ Core Functionality**
- [ ] User authentication works
- [ ] Assessment creation works
- [ ] Assessment taking works
- [ ] Results display correctly
- [ ] Dashboard analytics work
- [ ] User management works

### **✅ Data Integrity**
- [ ] All foreign keys work
- [ ] Data constraints enforced
- [ ] Cascade deletions work
- [ ] Data validation works

### **✅ User Experience**
- [ ] Navigation works smoothly
- [ ] Forms submit correctly
- [ ] Error messages are clear
- [ ] Loading states work
- [ ] Responsive design works

### **✅ Security**
- [ ] Authentication is secure
- [ ] Authorization works correctly
- [ ] Data is protected
- [ ] Input validation works

## 🆘 Troubleshooting

### **Common Issues**
1. **Database Connection**: Check environment variables
2. **Authentication**: Verify Supabase configuration
3. **Build Errors**: Check TypeScript errors
4. **Runtime Errors**: Check browser console

### **Debug Commands**
```bash
# Check database connection
npm run db:studio

# Check build errors
npm run build

# Check linting errors
npm run lint

# Check formatting
npm run format:check
```

## 📞 Support

If you encounter issues during testing:
1. Check the browser console for errors
2. Check the terminal for build errors
3. Verify environment variables are set
4. Check database connection
5. Review the documentation

---

**Happy Testing! 🎉**
