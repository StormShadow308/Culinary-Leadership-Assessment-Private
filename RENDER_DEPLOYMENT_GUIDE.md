# 🚀 Render.com Deployment Guide

## Prerequisites
- GitHub repository with your code
- Render.com account (free tier available)
- Supabase project set up
- PostgreSQL database (Render provides this)

## Step 1: Prepare Your Repository

### 1.1 Push to GitHub
```bash
# Add all changes
git add .

# Commit changes
git commit -m "Production ready: Enhanced error handling, health checks, and Render deployment"

# Push to GitHub
git push origin main
```

### 1.2 Verify Repository Structure
Ensure your repository has:
- ✅ `package.json` with correct scripts
- ✅ `server.js` for custom server
- ✅ `next.config.mjs` with production settings
- ✅ `env.example` with all required variables
- ✅ All source code in the root directory

## Step 2: Create Render.com Account & Service

### 2.1 Sign Up
1. Go to [render.com](https://render.com)
2. Sign up with your GitHub account
3. Connect your GitHub repository

### 2.2 Create Web Service
1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Select the repository: `culinary-leadership-assessment`

## Step 3: Configure Render Service

### 3.1 Basic Settings
```
Name: culinary-leadership-assessment
Environment: Node
Region: Oregon (US West) or closest to your users
Branch: main
Root Directory: (leave empty - code is in root)
Runtime: Node
Build Command: npm install && npm run build
Start Command: node server.js
```

### 3.2 Advanced Settings
```
Node Version: 18.x or 20.x
Auto-Deploy: Yes (for automatic deployments)
```

## Step 4: Set Environment Variables

### 4.1 Required Variables
Go to "Environment" tab and add:

```bash
# Database (Render will provide this)
DATABASE_URL=postgresql://username:password@host:port/database

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Application URLs (Update after deployment)
NEXT_PUBLIC_APP_URL=https://your-app-name.onrender.com
NEXT_PUBLIC_SITE_URL=https://your-app-name.onrender.com

# Environment
NODE_ENV=production

# Email Configuration
MAILERSEND_API_KEY=your_mailersend_api_key
EMAIL_FROM=notifications@yourdomain.com

# Authentication
BETTER_AUTH_SECRET=your_32_character_secret_key

# Optional: Database Connection Pool Settings
DB_POOL_MAX=20
DB_POOL_MIN=5
DB_IDLE_TIMEOUT=30000
DB_CONNECTION_TIMEOUT=2000

# Optional: Logging
LOG_LEVEL=info
```

### 4.2 Generate Secrets
```bash
# Generate BETTER_AUTH_SECRET (32 characters)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate ENCRYPTION_KEY (32 characters)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate JWT_SECRET (32 characters)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Step 5: Create PostgreSQL Database

### 5.1 Add Database Service
1. In Render dashboard, click "New +" → "PostgreSQL"
2. Configure:
   ```
   Name: culinary-assessment-db
   Database: culinary_assessment
   User: culinary_user
   Region: Same as your web service
   ```

### 5.2 Get Database URL
1. After creation, go to your database service
2. Copy the "External Database URL"
3. Use this as your `DATABASE_URL` in environment variables

## Step 6: Deploy and Test

### 6.1 Deploy
1. Click "Create Web Service"
2. Wait for build to complete (5-10 minutes)
3. Note your app URL: `https://your-app-name.onrender.com`

### 6.2 Update Environment Variables
After deployment, update:
```bash
NEXT_PUBLIC_APP_URL=https://your-actual-app-name.onrender.com
NEXT_PUBLIC_SITE_URL=https://your-actual-app-name.onrender.com
```

### 6.3 Run Database Migrations
```bash
# Connect to your Render service terminal or run locally with production DATABASE_URL
npm run db:migrate
npm run db:seed
```

## Step 7: Verify Deployment

### 7.1 Health Check
Visit: `https://your-app-name.onrender.com/api/health`

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-XX...",
  "environment": "production"
}
```

### 7.2 Detailed Health Check
Visit: `https://your-app-name.onrender.com/api/health?detailed=true`

### 7.3 Test Application
1. Visit your app URL
2. Test sign-in/sign-up
3. Test admin functionality
4. Test organization features

## Step 8: Configure Custom Domain (Optional)

### 8.1 Add Custom Domain
1. Go to your service settings
2. Add custom domain in "Custom Domains" section
3. Update DNS records as instructed

### 8.2 Update Environment Variables
```bash
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

## Step 9: Monitoring and Maintenance

### 9.1 Monitor Logs
- Go to your service → "Logs" tab
- Monitor for errors and performance

### 9.2 Set Up Alerts
- Configure uptime monitoring
- Set up error notifications

### 9.3 Regular Maintenance
- Monitor database performance
- Update dependencies regularly
- Backup database periodically

## Troubleshooting

### Common Issues

#### Build Fails
```bash
# Check build logs for:
- Missing environment variables
- TypeScript errors
- Dependency issues
```

#### Database Connection Issues
```bash
# Verify:
- DATABASE_URL is correct
- Database service is running
- SSL settings are correct
```

#### Supabase Issues
```bash
# Verify:
- Supabase URL and keys are correct
- Supabase project is active
- CORS settings allow your domain
```

#### App Crashes
```bash
# Check logs for:
- Memory issues
- Unhandled errors
- Database timeouts
```

### Performance Optimization

#### Enable Caching
```bash
# Add to environment variables:
CACHE_TTL=300000
REDIS_URL=your_redis_url  # If using Redis
```

#### Database Optimization
```bash
# Monitor query performance
# Add database indexes
# Optimize connection pool settings
```

## Security Checklist

- ✅ Environment variables are secure
- ✅ Database credentials are protected
- ✅ Supabase keys are properly configured
- ✅ CORS settings are correct
- ✅ Security headers are enabled
- ✅ HTTPS is enforced
- ✅ Error messages don't expose sensitive data

## Cost Optimization

### Free Tier Limits
- 750 hours/month
- 512MB RAM
- Sleeps after 15 minutes of inactivity

### Paid Plans
- Always-on service
- More resources
- Better performance
- Priority support

## Support

### Render Documentation
- [Render Docs](https://render.com/docs)
- [Node.js Guide](https://render.com/docs/node)
- [PostgreSQL Guide](https://render.com/docs/databases)

### Application Support
- Check health endpoint: `/api/health`
- Monitor logs in Render dashboard
- Test locally with production environment variables

---

## Quick Start Commands

```bash
# 1. Push to GitHub
git add . && git commit -m "Production ready" && git push

# 2. Create Render service
# (Use Render dashboard)

# 3. Set environment variables
# (Copy from env.example)

# 4. Deploy and test
# (Monitor build logs)

# 5. Run migrations
npm run db:migrate && npm run db:seed
```

**🎉 Your application should now be live on Render.com!**