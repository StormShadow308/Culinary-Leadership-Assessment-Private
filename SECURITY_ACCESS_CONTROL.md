# 🔐 Security & Access Control Guide

This guide explains the comprehensive role-based access control system implemented to ensure users can only access their authorized areas.

## 🎯 Overview

The system implements **strict role-based access control** to ensure:
- **Students** can only access student areas
- **Organizations** can only access organization areas  
- **Admins** can access all areas
- **Unauthorized access** is automatically blocked and redirected

## 👥 User Roles & Access

### **👑 Admin Users**
- **Can Access**: All routes (`/admin/*`, `/organisation/*`, `/assessment`, `/attempt/*`)
- **Cannot Access**: Authentication pages (redirected away)
- **Redirects**: Automatically redirected to `/admin` after login

### **🏢 Organization Users**
- **Can Access**: Organization routes (`/organisation/*`)
- **Cannot Access**: Admin routes, student routes, authentication pages
- **Redirects**: Automatically redirected to `/organisation` after login

### **🎓 Student Users**
- **Can Access**: Student routes (`/assessment`, `/attempt/*`)
- **Cannot Access**: Admin routes, organization routes, authentication pages
- **Redirects**: Automatically redirected to `/assessment` after login

## 🔒 Access Control Matrix

| Route Type | Admin | Organization | Student | Unauthenticated |
|------------|-------|--------------|---------|-----------------|
| `/admin/*` | ✅ | ❌ → `/organisation` | ❌ → `/assessment` | ❌ → `/sign-in` |
| `/organisation/*` | ✅ | ✅ | ❌ → `/assessment` | ❌ → `/sign-in` |
| `/assessment` | ✅ | ❌ → `/organisation` | ✅ | ❌ → `/sign-in` |
| `/attempt/*` | ✅ | ❌ → `/organisation` | ✅ | ❌ → `/sign-in` |
| `/sign-in` | ❌ → `/admin` | ❌ → `/organisation` | ❌ → `/assessment` | ✅ |
| `/sign-up` | ❌ → `/admin` | ❌ → `/organisation` | ❌ → `/assessment` | ✅ |

## 🛡️ Security Implementation

### **1. Middleware-Based Protection**
```typescript
// STRICT ROLE-BASED ACCESS CONTROL
if (user) {
  // ADMIN-ONLY ROUTES: Only admins can access
  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    if (userRole !== 'admin') {
      // Redirect based on user role
    }
  }
  
  // ORGANIZATION-ONLY ROUTES: Only organization users and admins
  if (pathname === '/organisation' || pathname.startsWith('/organisation/')) {
    if (userRole !== 'organization' && userRole !== 'admin') {
      // Redirect to appropriate area
    }
  }
  
  // STUDENT-ONLY ROUTES: Only students can access
  if (pathname === '/assessment' || pathname.startsWith('/attempt')) {
    if (userRole !== 'student') {
      // Redirect based on user role
    }
  }
}
```

### **2. Authentication State Validation**
- **Unauthenticated users** are redirected to `/sign-in`
- **Authenticated users** are redirected away from auth pages
- **Role validation** happens on every route access

### **3. Automatic Redirects**
- **Login success** → Redirect to role-appropriate area
- **Unauthorized access** → Redirect to user's authorized area
- **Auth page access** → Redirect authenticated users away

## 📊 Current User Distribution

| Role | Count | Users |
|------|-------|-------|
| **Admin** | 1 | Admin User (`admin@example.com`) |
| **Organization** | 2 | Test User (`test@example.com`), Huzaifa (`galtecmark@gmail.com`) |
| **Student** | 4 | Noah, Arkam, Taimoor, Test User 12 |

## 🧪 Testing Access Control

### **Test Scenarios**

#### **Admin User Login**
1. **Email**: `admin@example.com`
2. **Password**: `password123`
3. **Expected**: Redirected to `/admin`
4. **Access**: Can access all routes

#### **Organization User Login**
1. **Email**: `galtecmark@gmail.com`
2. **Password**: `password123`
3. **Expected**: Redirected to `/organisation`
4. **Access**: Can only access organization routes

#### **Student User Login**
1. **Email**: `povani8518@camjoint.com`
2. **Password**: `password123`
3. **Expected**: Redirected to `/assessment`
4. **Access**: Can only access student routes

### **Security Tests**

#### **Unauthorized Access Attempts**
- **Student trying to access `/admin`** → Redirected to `/assessment`
- **Organization trying to access `/assessment`** → Redirected to `/organisation`
- **Student trying to access `/organisation`** → Redirected to `/assessment`
- **Unauthenticated user accessing protected route** → Redirected to `/sign-in`

## 🔍 Security Monitoring

### **Logging**
All access attempts are logged with:
- User email and role
- Requested route
- Access decision (allowed/denied)
- Redirect destination

### **Example Logs**
```
🔐 Access Control: User admin@example.com (Role: admin) trying to access /admin
✅ Access granted to admin user

🔐 Access Control: User student@example.com (Role: student) trying to access /admin
❌ Access Denied: Non-admin user trying to access admin area
🔄 Redirecting to /assessment
```

## 🚨 Security Features

### **✅ Implemented**
- **Role-based route protection**
- **Automatic redirects for unauthorized access**
- **Authentication state validation**
- **Comprehensive access logging**
- **Middleware-based security enforcement**

### **🔒 Protection Against**
- **Unauthorized admin access**
- **Cross-role access attempts**
- **Unauthenticated route access**
- **Session hijacking**
- **Role escalation**

## 📋 Security Checklist

- ✅ **Admin routes** protected (only admins can access)
- ✅ **Organization routes** protected (only org users and admins)
- ✅ **Student routes** protected (only students can access)
- ✅ **Authentication pages** redirect authenticated users
- ✅ **Unauthenticated users** redirected to sign-in
- ✅ **Role-based redirects** after login
- ✅ **Comprehensive logging** for security monitoring
- ✅ **Middleware enforcement** on all routes

## 🎯 Benefits

### **For Security**
- **Prevents unauthorized access** to sensitive areas
- **Enforces role-based permissions** automatically
- **Logs all access attempts** for monitoring
- **Blocks cross-role access** attempts

### **For Users**
- **Clear role boundaries** and expectations
- **Automatic redirects** to appropriate areas
- **No confusion** about access permissions
- **Seamless user experience** within authorized areas

### **For Administrators**
- **Comprehensive access control** without manual intervention
- **Detailed security logs** for monitoring
- **Automatic enforcement** of security policies
- **Easy role management** through user database

## 🔧 Maintenance

### **Adding New Routes**
1. **Identify the role** that should access the route
2. **Add protection logic** in middleware
3. **Test with different user roles**
4. **Update documentation**

### **Changing User Roles**
1. **Update role** in local database
2. **Update role** in Supabase user metadata
3. **Test access** with new role
4. **Verify redirects** work correctly

---

**🎉 Result**: Comprehensive role-based access control ensures users can only access their authorized areas, providing robust security for the entire application!
