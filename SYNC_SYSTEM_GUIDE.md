# Data Synchronization System Guide

## Overview

The Data Synchronization System ensures that Supabase and the local database remain perfectly synchronized at all times. This comprehensive system prevents data inconsistencies, handles orphaned users, and maintains data integrity across both systems.

## 🏗️ Architecture

### Core Components

1. **SyncService** (`lib/sync-service.ts`)
   - Main synchronization service
   - Handles user data sync between Supabase and local database
   - Provides validation and repair mechanisms

2. **ScheduledSync** (`lib/scheduled-sync.ts`)
   - Automated sync job that runs periodically
   - Prevents data drift over time
   - Runs every hour automatically

3. **Sync Dashboard** (`app/admin/sync/`)
   - Admin interface for monitoring sync status
   - Manual sync controls
   - Real-time sync status visualization

4. **API Endpoints**
   - `/api/admin/sync` - Manual sync operations
   - `/api/admin/scheduled-sync` - Scheduled sync management
   - `/api/debug/user-exists` - Debug user existence

## 🔄 How It Works

### Automatic Synchronization

1. **User Registration**: After creating a user, the system validates sync status
2. **User Deletion**: After deleting a user, the system validates sync status
3. **Scheduled Jobs**: Every hour, the system checks and repairs any inconsistencies

### Sync Process

1. **Validation**: Check data integrity between systems
2. **Detection**: Identify orphaned users and data inconsistencies
3. **Repair**: Automatically fix issues found
4. **Verification**: Confirm systems are in sync

## 📊 Sync Status Types

### User Status
- **In Sync**: User exists in both systems with consistent data
- **Local Only**: User exists in local database but not in Supabase
- **Supabase Only**: User exists in Supabase but not in local database
- **Inconsistent**: User exists in both systems but data doesn't match

### Data Consistency Checks
- User ID matching
- Email address consistency
- Name consistency
- Email verification status
- Role consistency

## 🛠️ Admin Operations

### Sync Dashboard Features

1. **Status Overview**
   - Total users count
   - In-sync users count
   - Issues count
   - Sync progress percentage

2. **User Table**
   - Individual user sync status
   - Local database status
   - Supabase status
   - Issue details
   - Individual sync actions

3. **Bulk Operations**
   - Sync all users
   - Refresh status
   - View detailed logs

### Manual Sync Operations

```typescript
// Sync all users
POST /api/admin/sync
{
  "action": "sync-all"
}

// Sync specific user
POST /api/admin/sync
{
  "action": "sync-user",
  "email": "user@example.com"
}

// Get sync status
GET /api/admin/sync?action=status

// Validate data integrity
GET /api/admin/sync?action=validate
```

## 🔧 Configuration

### Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
DATABASE_URL=your_database_url
```

### Sync Settings

- **Auto-sync interval**: 1 hour (configurable)
- **Validation checks**: User ID, email, name, verification status
- **Error handling**: Graceful degradation with detailed logging
- **Concurrent protection**: Prevents multiple sync operations

## 📈 Monitoring

### Logs

The system provides comprehensive logging:

```
🔄 Starting scheduled sync job #1...
🔍 Checking sync status for all users...
📊 Found 25 users in local database
📊 Found 25 users in Supabase
✅ Data integrity check passed - no sync needed
✅ Scheduled sync job #1 completed
```

### Health Checks

- **Data Integrity Validation**: Checks for inconsistencies
- **Orphaned User Detection**: Finds users in one system but not the other
- **Sync Status Monitoring**: Tracks sync success/failure rates

## 🚨 Error Handling

### Common Issues

1. **Orphaned Users**
   - **Cause**: Incomplete deletion or failed sync
   - **Solution**: Automatic cleanup during next sync

2. **Data Inconsistencies**
   - **Cause**: Partial updates or sync failures
   - **Solution**: Automatic repair using local database as source of truth

3. **Supabase API Errors**
   - **Cause**: Network issues or API limits
   - **Solution**: Retry logic with exponential backoff

### Error Recovery

- **Graceful Degradation**: System continues to function even if sync fails
- **Detailed Logging**: All errors are logged with context
- **Manual Intervention**: Admin can trigger manual sync if needed

## 🔒 Security

### Access Control

- **Admin Only**: All sync operations require admin privileges
- **API Authentication**: All endpoints check user authentication
- **Audit Logging**: All sync operations are logged

### Data Protection

- **Transaction Safety**: All database operations use transactions
- **Rollback Capability**: Failed syncs can be rolled back
- **Data Validation**: All data is validated before sync

## 📋 Best Practices

### For Developers

1. **Always use the sync service** for user operations
2. **Check sync status** after critical operations
3. **Monitor logs** for sync issues
4. **Test sync functionality** in development

### For Administrators

1. **Monitor the sync dashboard** regularly
2. **Run manual sync** if issues are detected
3. **Check logs** for error patterns
4. **Verify data integrity** after major changes

## 🚀 Usage Examples

### Check Sync Status

```typescript
import { SyncService } from '~/lib/sync-service';

// Get sync status for all users
const syncStatus = await SyncService.getSyncStatus();
console.log(`Found ${syncStatus.length} users`);
console.log(`In sync: ${syncStatus.filter(s => s.inSync).length}`);
```

### Sync Specific User

```typescript
// Sync a specific user
const result = await SyncService.syncUserByEmail('user@example.com');
if (result.success) {
  console.log('User synced successfully');
} else {
  console.error('Sync failed:', result.message);
}
```

### Validate Data Integrity

```typescript
// Check data integrity
const validation = await SyncService.validateDataIntegrity();
if (!validation.isValid) {
  console.warn('Data integrity issues found:', validation.issues);
  console.log('Recommendations:', validation.recommendations);
}
```

## 🔄 Maintenance

### Regular Tasks

1. **Monitor sync dashboard** for issues
2. **Check logs** for error patterns
3. **Verify data integrity** after major changes
4. **Update sync intervals** if needed

### Troubleshooting

1. **Check API connectivity** to Supabase
2. **Verify database connections**
3. **Review error logs** for specific issues
4. **Run manual sync** to resolve issues

## 📚 API Reference

### SyncService Methods

- `getSyncStatus()`: Get sync status for all users
- `syncAllUsers()`: Sync all users between systems
- `syncUserByEmail(email)`: Sync specific user
- `validateDataIntegrity()`: Check data consistency

### API Endpoints

- `GET /api/admin/sync?action=status`: Get sync status
- `GET /api/admin/sync?action=validate`: Validate data integrity
- `POST /api/admin/sync`: Perform sync operations
- `GET /api/admin/scheduled-sync`: Get scheduled sync status
- `POST /api/admin/scheduled-sync`: Trigger manual scheduled sync

This comprehensive sync system ensures that your Supabase and local database are always perfectly synchronized, preventing data inconsistencies and maintaining system reliability.
