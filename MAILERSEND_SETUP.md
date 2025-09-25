# MailerSend Setup Guide

This guide will help you set up MailerSend for production-ready email functionality in your Culinary Leadership Assessment application.

## 🔧 **Required Environment Variables**

Add these to your `.env.local` file:

```env
# MailerSend Configuration
MAILERSEND_API_KEY=your_mailersend_api_key_here
EMAIL_FROM=your-verified-email@yourdomain.com

# Application URLs
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## 📧 **MailerSend Account Setup**

### 1. Create MailerSend Account
1. Go to [MailerSend](https://www.mailersend.com/)
2. Sign up for a free account
3. Verify your email address

### 2. Get API Key
1. Log into your MailerSend dashboard
2. Go to **Settings** → **API Tokens**
3. Create a new API token
4. Copy the token and add it to your `.env.local` as `MAILERSEND_API_KEY`

### 3. Verify Domain (Production)
1. Go to **Domains** in your MailerSend dashboard
2. Add your domain (e.g., `yourdomain.com`)
3. Add the required DNS records to verify domain ownership
4. Once verified, you can use `noreply@yourdomain.com` as your `EMAIL_FROM`

### 4. For Development/Testing
- You can use the default MailerSend sandbox domain
- Set `EMAIL_FROM=test@mailersend.com` (or any verified email)
- This works for testing but emails may go to spam

## 🧪 **Testing Email Configuration**

### Test API Endpoint
Visit: `http://localhost:3000/api/test-email`

This will check:
- ✅ MailerSend API key is configured
- ✅ Email FROM address is set
- ✅ MailerSend connection is working

### Expected Response (Success)
```json
{
  "configured": true,
  "apiKey": "Set",
  "emailFrom": "your-email@yourdomain.com",
  "testResult": {
    "success": true,
    "data": { ... }
  }
}
```

### Expected Response (Error)
```json
{
  "error": "MailerSend API key not configured",
  "configured": false,
  "missing": "MAILERSEND_API_KEY"
}
```

## 🚀 **Production Deployment**

### 1. Environment Variables
Set these in your production environment (Vercel, Netlify, etc.):

```env
MAILERSEND_API_KEY=your_production_api_key
EMAIL_FROM=noreply@yourdomain.com
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

### 2. Domain Verification
- Verify your production domain in MailerSend
- Update `EMAIL_FROM` to use your verified domain
- Update `NEXT_PUBLIC_SITE_URL` to your production URL

### 3. DNS Records
Add these DNS records to your domain:
```
Type: TXT
Name: @
Value: mailersend-verification=your-verification-code
```

## 📝 **Email Templates**

The application includes three professional email templates:

1. **Confirmation Email** - Sent when users register
2. **Password Reset Email** - Sent when users request password reset
3. **Welcome Email** - Sent after email confirmation

All templates are:
- ✅ Mobile-responsive
- ✅ Professional design
- ✅ Branded with your application name
- ✅ Include proper security notices

## 🔍 **Troubleshooting**

### Common Issues

1. **"MailerSend is not initialized"**
   - Check if `MAILERSEND_API_KEY` is set
   - Verify the API key is correct

2. **"Failed to send confirmation email"**
   - Check if `EMAIL_FROM` is set
   - Verify the email address is verified in MailerSend
   - Check MailerSend dashboard for delivery logs

3. **Emails going to spam**
   - Verify your domain in MailerSend
   - Use a proper domain for `EMAIL_FROM`
   - Add SPF/DKIM records to your domain

### Debug Steps

1. **Check server logs** for detailed error messages
2. **Test email configuration** at `/api/test-email`
3. **Check MailerSend dashboard** for delivery status
4. **Verify environment variables** are loaded correctly

## 📊 **Monitoring**

### MailerSend Dashboard
- View email delivery statistics
- Monitor bounce rates
- Check spam complaints
- View detailed logs

### Application Logs
The application logs all email activities:
- ✅ Successful email sends
- ❌ Failed email attempts
- 📧 Email details (recipient, subject)

## 🎯 **Next Steps**

1. Set up your MailerSend account
2. Add environment variables
3. Test the configuration
4. Deploy to production
5. Monitor email delivery

Your email system is now production-ready! 🚀
