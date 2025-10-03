# Troubleshooting Guide

## Build Manifest Errors

If you encounter errors like:
```
Error: ENOENT: no such file or directory, open 'D:\path\.next\server\app\organisation\page\app-build-manifest.json'
```

### Quick Fix (Windows)
```bash
npm run clean:win
```

### Quick Fix (Linux/Mac)
```bash
npm run clean
```

### Manual Fix
1. Stop all Node.js processes:
   ```bash
   taskkill /f /im node.exe  # Windows
   pkill -f node            # Linux/Mac
   ```

2. Clean all caches:
   ```bash
   Remove-Item -Recurse -Force .next     # Windows PowerShell
   rm -rf .next                          # Linux/Mac
   rm -rf node_modules
   npm cache clean --force
   ```

3. Reinstall dependencies:
   ```bash
   npm install
   ```

4. Start development server:
   ```bash
   npm run dev
   ```

## Organization Selection Issues

### Problem: "Organization Selection Required" alert shows but no selector appears

**Solution**: The organization selector should now appear above the alert message. If it doesn't:

1. Check browser console for JavaScript errors
2. Ensure you're logged in as an admin user
3. Verify the global organization context is working

### Problem: Organization selection doesn't persist across navigation

**Solution**: The fix includes `router.refresh()` calls to force server component re-rendering. If issues persist:

1. Check if URL parameters are updating correctly
2. Verify the global organization context is properly synced
3. Clear browser cache and try again

## Development Server Issues

### Problem: Server won't start or crashes frequently

**Solution**:
1. Use the clean development script: `npm run dev:clean`
2. Check for port conflicts (default port 3000)
3. Verify all environment variables are set correctly

### Problem: Hot reload not working

**Solution**:
1. Clear `.next` directory: `rm -rf .next`
2. Restart development server: `npm run dev`
3. Check for file system watching limits (especially on Windows)

## Database Issues

### Problem: Database connection errors

**Solution**:
1. Check if PostgreSQL is running: `npm run db:start`
2. Verify connection string in `.env.local`
3. Reset database: `npm run db:reset`

## Common Commands

```bash
# Clean everything and start fresh
npm run dev:clean

# Clean only (Windows)
npm run clean:win

# Clean only (Linux/Mac)
npm run clean

# Build for production
npm run build

# Start production server
npm start

# Database operations
npm run db:start    # Start database
npm run db:stop     # Stop database
npm run db:reset    # Reset database
npm run db:studio   # Open database studio
```

## Prevention

To prevent build manifest errors:

1. **Always stop the dev server** before making major changes
2. **Use the clean scripts** when switching branches or after major updates
3. **Avoid rapid file changes** that can overwhelm the file watcher
4. **Keep dependencies updated** regularly

## Still Having Issues?

1. Check the browser console for specific error messages
2. Look at the terminal output for server-side errors
3. Verify all environment variables are correctly set
4. Ensure you're using the correct Node.js version (18+)
5. Try running `npm run clean` and starting fresh
