# Production Email Setup Guide

This guide ensures your MailerSend integration works perfectly in production.

## 🔧 Required Environment Variables

Add these to your `.env.local` file (for development) and your production environment:

```env
# MailerSend Configuration
MAILERSEND_API_KEY=your_mailersend_api_key_here
EMAIL_FROM=your-verified-email@yourdomain.com

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

## 📧 MailerSend Setup Steps

### 1. Create MailerSend Account
- Go to [MailerSend](https://www.mailersend.com/)
- Sign up for an account
- Choose a plan that fits your needs

### 2. Get API Key
- Go to [API Keys](https://app.mailersend.com/api-keys)
- Click "Create API Key"
- Give it a name like "Culinary Assessment App"
- Copy the API key (starts with `mlsn.`)

### 3. Verify Sender Domain
- Go to [Domains](https://app.mailersend.com/domains)
- Click "Add Domain"
- Enter your domain (e.g., `yourdomain.com`)
- Follow DNS setup instructions
- Wait for verification (can take up to 24 hours)

### 4. Verify Sender Email
- Go to [Senders](https://app.mailersend.com/senders)
- Click "Add Sender"
- Enter your email address
- Verify the email by clicking the link sent to your inbox

## 🧪 Testing Your Setup

### 1. Check Configuration
Visit: `http://localhost:3000/api/check-email-config`

Should show:
```
✅ MAILERSEND_API_KEY: Set
✅ EMAIL_FROM: your-verified-email@yourdomain.com
✅ SUPABASE_URL: Set
✅ SUPABASE_ANON_KEY: Set
✅ SUPABASE_SERVICE_KEY: Set
```

### 2. Test Email Sending
```bash
curl -X POST http://localhost:3000/api/test-passcode \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

### 3. Test Full Flow
1. Go to `/forgot-password`
2. Enter your email
3. Check your inbox for the 6-digit code
4. Enter the code on `/verify-email`
5. Should work perfectly!

## 🚨 Common Issues & Solutions

### Issue: "MailerSend is not initialized"
**Solution**: Check your `MAILERSEND_API_KEY` environment variable

### Issue: "Sender email not verified"
**Solution**: Verify your sender email in MailerSend dashboard

### Issue: "Rate limit exceeded"
**Solution**: 
- Wait a few minutes
- Upgrade your MailerSend plan
- Check your sending limits

### Issue: "Invalid API key"
**Solution**: 
- Regenerate your API key in MailerSend
- Make sure you copied it correctly
- Check for extra spaces or characters

### Issue: "Domain not verified"
**Solution**:
- Complete DNS setup in MailerSend
- Wait for verification (up to 24 hours)
- Check your domain's DNS records

## 🔒 Production Security

### 1. Environment Variables
- Never commit `.env.local` to version control
- Use your hosting platform's environment variable settings
- Rotate API keys regularly

### 2. Rate Limiting
- Monitor your email sending limits
- Implement proper error handling
- Consider upgrading your MailerSend plan for higher limits

### 3. Monitoring
- Set up email delivery monitoring
- Monitor bounce rates
- Track email open rates

## 📊 Production Checklist

- [ ] MailerSend account created
- [ ] API key generated and configured
- [ ] Sender domain verified
- [ ] Sender email verified
- [ ] Environment variables set in production
- [ ] Test emails working
- [ ] Error handling implemented
- [ ] Monitoring set up

## 🎯 Production Deployment

### Vercel
1. Go to your project settings
2. Add environment variables in "Environment Variables" section
3. Redeploy your application

### Netlify
1. Go to Site settings
2. Add environment variables in "Environment variables" section
3. Redeploy your site

### Other Platforms
- Add environment variables in your hosting platform's settings
- Ensure all required variables are set
- Test the email functionality after deployment

## 📞 Support

If you encounter issues:
1. Check the MailerSend dashboard for account status
2. Verify all environment variables are set correctly
3. Test with the provided test endpoints
4. Check the application logs for specific error messages

## 🎉 Success!

Once everything is configured correctly, your application will:
- Send professional HTML emails
- Handle passcode verification seamlessly
- Provide excellent user experience
- Work reliably in production
