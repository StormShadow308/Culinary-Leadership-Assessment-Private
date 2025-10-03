# Clean Development Environment Script for Windows
# This script cleans all caches and temporary files to prevent build manifest errors

Write-Host "🧹 Cleaning development environment..." -ForegroundColor Green

# Kill any running Node.js processes
Write-Host "🛑 Stopping Node.js processes..." -ForegroundColor Yellow
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue

# Remove build artifacts
Write-Host "🗑️  Removing .next directory..." -ForegroundColor Yellow
if (Test-Path ".next") {
    Remove-Item -Recurse -Force ".next"
}

# Remove node_modules
Write-Host "🗑️  Removing node_modules..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Remove-Item -Recurse -Force "node_modules"
}

# Clean npm cache
Write-Host "🧽 Cleaning npm cache..." -ForegroundColor Yellow
npm cache clean --force

# Reinstall dependencies
Write-Host "📦 Reinstalling dependencies..." -ForegroundColor Yellow
npm install

# Start development server
Write-Host "🚀 Starting development server..." -ForegroundColor Green
npm run dev
