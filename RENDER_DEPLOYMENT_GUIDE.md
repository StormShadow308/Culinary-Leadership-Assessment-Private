# 🚀 Render.com Deployment Guide

## 📋 **Prerequisites**

1. **Render.com Account** - Sign up at [render.com](https://render.com)
2. **GitHub Repository** - Push your code to GitHub
3. **Supabase Project** - Set up authentication
4. **MailerSend Account** - For email functionality

---

## 🔧 **Step-by-Step Deployment**

### 1. **Prepare Your Repository**

Ensure all fixes are applied:
- ✅ `next.config.mjs` updated with Render compatibility
- ✅ `server.js` created for PORT support
- ✅ `env.example` created with all required variables
- ✅ Hardcoded localhost references fixed

### 2. **Create Render Web Service**

1. **Connect Repository**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository branch

2. **Configure Build Settings**
   ```
   Build Command: npm run build
   Start Command: npm start
   ```

3. **Set Environment Variables**
   Copy all variables from `env.example` and update with your values:

   **Required Variables:**
   ```
   DATABASE_URL=postgresql://... (Render will provide this)
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   NEXT_PUBLIC_APP_URL=https://your-app.onrender.com
   NEXT_PUBLIC_SITE_URL=https://your-app.onrender.com
   NODE_ENV=production
   MAILERSEND_API_KEY=your_mailersend_key
   EMAIL_FROM=notifications@yourdomain.com
   BETTER_AUTH_SECRET=your_32_character_secret
   ```

### 3. **Set Up PostgreSQL Database**

1. **Create Database**
   - Go to Render Dashboard
   - Click "New +" → "PostgreSQL"
   - Choose a name and region
   - Note the connection details

2. **Run Database Migrations**
   - After deployment, connect to your database
   - Run: `npm run db:migrate` (if you have migration scripts)
   - Or manually create tables using your schema

### 4. **Deploy and Test**

1. **Deploy**
   - Click "Create Web Service"
   - Wait for build to complete (5-10 minutes)
   - Note your app URL

2. **Test Deployment**
   - Visit your app URL
   - Test sign-in/sign-up functionality
   - Test email invitations
   - Check all API endpoints

---

## 🔍 **Troubleshooting**

### Common Issues

1. **Build Fails**
   - Check build logs in Render dashboard
   - Ensure all dependencies are in `package.json`
   - Verify Node.js version compatibility

2. **App Won't Start**
   - Check start command: `npm start`
   - Verify `server.js` exists
   - Check environment variables

3. **Database Connection Issues**
   - Verify `DATABASE_URL` is set correctly
   - Check database is running
   - Ensure SSL is enabled for production

4. **Email Not Working**
   - Verify `MAILERSEND_API_KEY` is set
   - Check `EMAIL_FROM` domain is verified
   - Test email configuration

### Debug Commands

```bash
# Check environment variables
echo $DATABASE_URL

# Test database connection
node -e "console.log(process.env.DATABASE_URL)"

# Check if app starts locally
npm run build && npm start
```

---

## 📊 **Post-Deployment Checklist**

- [ ] App loads at your Render URL
- [ ] Sign-in/sign-up works
- [ ] Database queries work
- [ ] Email invitations work
- [ ] All API endpoints respond
- [ ] Static assets load correctly
- [ ] No console errors in browser
- [ ] Performance is acceptable

---

## 🚀 **Production Optimizations**

### 1. **Enable HTTPS**
- Render provides HTTPS by default
- Update all URLs to use `https://`

### 2. **Set Up Monitoring**
- Add error tracking (Sentry)
- Monitor database performance
- Set up uptime monitoring

### 3. **Security**
- Rotate all secrets regularly
- Enable database SSL
- Review access permissions

### 4. **Performance**
- Enable Next.js caching
- Optimize images
- Monitor bundle size

---

## 📞 **Support**

If you encounter issues:

1. **Check Render Logs** - Dashboard → Your Service → Logs
2. **Verify Environment Variables** - Dashboard → Your Service → Environment
3. **Test Locally** - Run `npm run build && npm start`
4. **Check Database** - Ensure PostgreSQL is running and accessible

---

## 🎯 **Success Indicators**

✅ **Deployment Successful When:**
- App loads without errors
- Authentication works
- Database queries succeed
- Email functionality works
- All features are accessible
- Performance is acceptable

**Your app is now live on Render.com! 🎉**
