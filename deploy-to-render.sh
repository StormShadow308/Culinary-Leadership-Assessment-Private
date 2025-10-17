#!/bin/bash

# 🚀 Render.com Deployment Script
# This script helps prepare and deploy your application to Render.com

echo "🚀 CULINARY LEADERSHIP ASSESSMENT - RENDER DEPLOYMENT"
echo "====================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if git is initialized
if [ ! -d ".git" ]; then
    print_error "Git repository not initialized. Please run 'git init' first."
    exit 1
fi

# Check if we're on main branch
current_branch=$(git branch --show-current)
if [ "$current_branch" != "main" ] && [ "$current_branch" != "master" ]; then
    print_warning "You're not on main/master branch. Current branch: $current_branch"
    read -p "Do you want to continue? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Step 1: Check for uncommitted changes
print_info "Checking for uncommitted changes..."
if ! git diff-index --quiet HEAD --; then
    print_warning "You have uncommitted changes."
    git status --short
    read -p "Do you want to commit them now? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git add .
        git commit -m "Production ready: Enhanced error handling, health checks, and Render deployment"
        print_status "Changes committed"
    else
        print_error "Please commit your changes before deploying"
        exit 1
    fi
else
    print_status "No uncommitted changes"
fi

# Step 2: Check if remote origin exists
print_info "Checking remote repository..."
if ! git remote get-url origin > /dev/null 2>&1; then
    print_error "No remote origin found. Please add your GitHub repository:"
    echo "git remote add origin https://github.com/yourusername/culinary-leadership-assessment.git"
    exit 1
fi

print_status "Remote origin found: $(git remote get-url origin)"

# Step 3: Push to GitHub
print_info "Pushing to GitHub..."
if git push origin $current_branch; then
    print_status "Successfully pushed to GitHub"
else
    print_error "Failed to push to GitHub. Please check your credentials and try again."
    exit 1
fi

# Step 4: Check environment variables
print_info "Checking environment variables..."
if [ ! -f ".env.local" ]; then
    print_warning ".env.local file not found"
    print_info "Please create .env.local with the following variables:"
    echo ""
    cat env.example
    echo ""
    read -p "Press Enter after setting up your environment variables..."
fi

# Step 5: Generate secrets if needed
print_info "Generating secrets for production..."
echo ""
echo "🔐 GENERATED SECRETS FOR RENDER:"
echo "================================"
echo "BETTER_AUTH_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")"
echo "ENCRYPTION_KEY=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")"
echo "JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")"
echo ""

# Step 6: Display next steps
print_info "NEXT STEPS FOR RENDER DEPLOYMENT:"
echo ""
echo "1. 🌐 Go to https://render.com"
echo "2. 🔐 Sign up/Login with your GitHub account"
echo "3. ➕ Click 'New +' → 'Web Service'"
echo "4. 🔗 Connect your GitHub repository: $(git remote get-url origin)"
echo "5. ⚙️  Configure the service:"
echo "   - Name: culinary-leadership-assessment"
echo "   - Environment: Node"
echo "   - Build Command: npm install && npm run build"
echo "   - Start Command: node server.js"
echo "6. 🔧 Add environment variables (see generated secrets above)"
echo "7. 🗄️  Create PostgreSQL database service"
echo "8. 🚀 Deploy and test!"
echo ""

# Step 7: Test build locally
print_info "Testing build locally..."
if npm run build; then
    print_status "Local build successful! Ready for deployment."
else
    print_error "Local build failed. Please fix errors before deploying."
    exit 1
fi

echo ""
print_status "🎉 Your code is ready for Render deployment!"
print_info "Follow the steps above to complete your deployment."
print_info "For detailed instructions, see RENDER_DEPLOYMENT_GUIDE.md"
