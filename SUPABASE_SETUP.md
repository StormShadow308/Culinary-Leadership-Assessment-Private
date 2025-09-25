# 🔧 Supabase Setup Guide

## 📋 Prerequisites
1. Create a Supabase account at [supabase.com](https://supabase.com)
2. Create a new project in Supabase
3. Get your project URL and API keys

## 🔑 Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Database (keep existing)
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password
POSTGRES_DB=culinary_assessment
POSTGRES_PORT=5432
DATABASE_URL=postgresql://postgres:password@localhost:5432/culinary_assessment

# Supabase (new)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Email (keep existing)
RESEND_API_KEY=your_resend_api_key
EMAIL_FROM=noreply@yourdomain.com
```

## 🚀 Getting Supabase Credentials

### 1. Project URL
- Go to your Supabase project dashboard
- Copy the "Project URL" from the Settings > API section

### 2. API Keys
- Go to Settings > API in your Supabase dashboard
- Copy the "anon public" key for `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Copy the "service_role" key for `SUPABASE_SERVICE_ROLE_KEY`

## 🔐 Supabase Authentication Setup

### 1. Enable Email Authentication
- Go to Authentication > Settings in your Supabase dashboard
- Enable "Email" provider
- Configure email templates if needed

### 2. Configure Email Settings
- Set up email confirmation (optional)
- Configure password reset settings
- Set up email templates

### 3. User Management
- Go to Authentication > Users to manage users
- You can create users manually or let them sign up

## 🗄️ Database Setup

### 1. Local Database (Keep Existing)
Your local PostgreSQL database will continue to work for:
- User profiles and roles
- Organizations and cohorts
- Assessment data
- Analytics

### 2. Supabase Database (Optional)
You can optionally use Supabase's database instead of local PostgreSQL:
- Go to Database > Tables in Supabase
- Create tables matching your schema
- Use Supabase's database instead of local PostgreSQL

## 🔄 User Synchronization

The system now syncs users between Supabase and your local database:

1. **Supabase**: Handles authentication (login, signup, sessions)
2. **Local Database**: Stores user profiles, roles, and application data
3. **Sync**: Users are automatically synced when they authenticate

## 🧪 Testing the Setup

### 1. Start the Development Server
```bash
npm run dev
```

### 2. Test Authentication
- Go to http://localhost:3000/sign-in
- Try signing in with existing credentials
- Try signing up with new credentials

### 3. Check User Sync
- Sign in with a user
- Check your local database to see if the user was synced
- Verify the user can access appropriate routes

## 🛠️ Troubleshooting

### Common Issues

1. **"Invalid Supabase URL"**
   - Check your `NEXT_PUBLIC_SUPABASE_URL` in `.env.local`
   - Ensure it includes `https://` and your project reference

2. **"Invalid API Key"**
   - Verify your `NEXT_PUBLIC_SUPABASE_ANON_KEY` is correct
   - Check that it's the "anon public" key, not the service role key

3. **Authentication Not Working**
   - Check browser console for errors
   - Verify Supabase project is active
   - Check if email authentication is enabled

4. **User Sync Issues**
   - Check if user exists in Supabase Auth
   - Verify local database connection
   - Check console logs for sync errors

### Debug Commands

```bash
# Check environment variables
echo $NEXT_PUBLIC_SUPABASE_URL

# Test database connection
npm run db:studio

# Check Supabase connection
# Look for errors in browser console
```

## 📚 Next Steps

1. **Configure Email Templates**: Customize signup and password reset emails
2. **Set Up Row Level Security**: Configure database security policies
3. **Add Social Auth**: Enable Google, GitHub, etc. authentication
4. **Monitor Usage**: Use Supabase dashboard to monitor authentication

## 🔒 Security Notes

- Never commit `.env.local` to version control
- Use environment variables for all sensitive data
- Regularly rotate your API keys
- Monitor authentication logs in Supabase dashboard

---

**Your authentication system is now powered by Supabase! 🎉**
