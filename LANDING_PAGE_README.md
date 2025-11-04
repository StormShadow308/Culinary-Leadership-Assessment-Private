# Landing Page Integration

## Overview
The landing page is a static site built with Vite + React + Tailwind CSS, integrated into the Next.js application.

## Architecture

### File Structure
```
public/
├── landing-site/          # Built static landing page
│   ├── index.html        # Main HTML file
│   ├── assets/           # JS and CSS bundles
│   └── lovable-uploads/  # Landing page images
└── lovable-uploads/       # Images (also at root for direct access)

app/
├── page.tsx              # Root page (redirects to landing)
└── landing/
    └── page.tsx          # Landing route (redirects to static site)
```

### How It Works
1. User visits `/` → redirects to `/landing-site/index.html`
2. User visits `/landing` → redirects to `/landing-site/index.html`
3. Static site loads with all assets from `/landing-site/`
4. Images load from `/lovable-uploads/` (excluded from middleware)
5. Clicks on "Start Assessment" → redirect to `/sign-up`
6. Clicks on dashboard links → redirect to `/sign-in`

## Updating the Landing Page

### Prerequisites
- Node.js installed
- Access to the Landing page source folder

### Steps to Update

1. **Navigate to Landing Page Source**
   ```bash
   cd "d:\culinary-leadership-assessment\Landing page\culinary-leadership-assessment"
   ```

2. **Make Your Changes**
   - Edit files in `src/` folder
   - Update components, styles, or content

3. **Build the Landing Page**
   ```bash
   npm run build
   ```

4. **Copy Built Files to Next.js**
   ```powershell
   # Remove old files
   Remove-Item -Recurse -Force "d:\culinary-leadership-assessment\culinary-leadership-assessment\public\landing-site"
   
   # Copy new build
   Copy-Item -Path "dist\*" -Destination "d:\culinary-leadership-assessment\culinary-leadership-assessment\public\landing-site\" -Recurse -Force
   ```

5. **Update Click Interceptor** (if needed)
   - Edit `public/landing-site/index.html`
   - Update the JavaScript that intercepts clicks

6. **Test Locally**
   ```bash
   cd "d:\culinary-leadership-assessment\culinary-leadership-assessment"
   npm run dev
   ```

## Configuration

### Middleware Exclusions
The following paths are excluded from authentication middleware:
- `/landing-site/*` - Static landing page files
- `/lovable-uploads/*` - Landing page images

### Caching Headers
Static assets are cached for 1 year:
- `/landing-site/*` - Immutable cache
- `/lovable-uploads/*` - Immutable cache

### Security Headers
All pages include:
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: origin-when-cross-origin`

## Production Deployment

### Build Process
```bash
# Build Next.js app
npm run build

# Landing page is already built and included in public/
```

### Environment Variables
No special environment variables needed for landing page.

### Performance Optimizations
- ✅ Static assets with long-term caching
- ✅ Preloaded critical CSS and JS
- ✅ Compressed assets (Vite build)
- ✅ Optimized images
- ✅ Deferred JavaScript loading

## Troubleshooting

### Images Not Loading
1. Check `/public/lovable-uploads/` exists
2. Verify middleware excludes `lovable-uploads`
3. Clear browser cache (Ctrl+F5)

### Redirects Not Working
1. Check `public/landing-site/index.html` has click interceptor
2. Verify JavaScript is loading (check browser console)
3. Test with browser dev tools network tab

### Styles Not Applying
1. Verify CSS file exists in `/public/landing-site/assets/`
2. Check browser console for 404 errors
3. Rebuild landing page with correct base path

## Maintenance

### Regular Updates
- Rebuild landing page when content changes
- Update meta tags for SEO improvements
- Optimize images periodically

### Monitoring
- Check browser console for errors
- Monitor Core Web Vitals
- Test on multiple devices/browsers

## Contact
For issues or questions, contact the development team.
