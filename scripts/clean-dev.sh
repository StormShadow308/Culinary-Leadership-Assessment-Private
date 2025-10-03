#!/bin/bash

# Clean Development Environment Script
# This script cleans all caches and temporary files to prevent build manifest errors

echo "🧹 Cleaning development environment..."

# Kill any running Node.js processes
echo "🛑 Stopping Node.js processes..."
pkill -f node || true

# Remove build artifacts
echo "🗑️  Removing .next directory..."
rm -rf .next

# Remove node_modules
echo "🗑️  Removing node_modules..."
rm -rf node_modules

# Clean npm cache
echo "🧽 Cleaning npm cache..."
npm cache clean --force

# Reinstall dependencies
echo "📦 Reinstalling dependencies..."
npm install

# Start development server
echo "🚀 Starting development server..."
npm run dev
