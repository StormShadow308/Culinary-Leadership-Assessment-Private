# 🚀 Render.com Deployment Script (PowerShell)
# This script helps prepare and deploy your application to Render.com

Write-Host "🚀 CULINARY LEADERSHIP ASSESSMENT - RENDER DEPLOYMENT" -ForegroundColor Green
Write-Host "=====================================================" -ForegroundColor Green

# Function to print colored output
function Write-Status {
    param([string]$Message)
    Write-Host "✅ $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "⚠️  $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "❌ $Message" -ForegroundColor Red
}

function Write-Info {
    param([string]$Message)
    Write-Host "ℹ️  $Message" -ForegroundColor Blue
}

# Check if git is initialized
if (-not (Test-Path ".git")) {
    Write-Error "Git repository not initialized. Please run 'git init' first."
    exit 1
}

# Check if we're on main branch
$currentBranch = git branch --show-current
if ($currentBranch -ne "main" -and $currentBranch -ne "master") {
    Write-Warning "You're not on main/master branch. Current branch: $currentBranch"
    $continue = Read-Host "Do you want to continue? (y/N)"
    if ($continue -notmatch "^[Yy]$") {
        exit 1
    }
}

# Step 1: Check for uncommitted changes
Write-Info "Checking for uncommitted changes..."
$gitStatus = git status --porcelain
if ($gitStatus) {
    Write-Warning "You have uncommitted changes:"
    git status --short
    $commit = Read-Host "Do you want to commit them now? (y/N)"
    if ($commit -match "^[Yy]$") {
        git add .
        git commit -m "Production ready: Enhanced error handling, health checks, and Render deployment"
        Write-Status "Changes committed"
    } else {
        Write-Error "Please commit your changes before deploying"
        exit 1
    }
} else {
    Write-Status "No uncommitted changes"
}

# Step 2: Check if remote origin exists
Write-Info "Checking remote repository..."
try {
    $remoteUrl = git remote get-url origin
    Write-Status "Remote origin found: $remoteUrl"
} catch {
    Write-Error "No remote origin found. Please add your GitHub repository:"
    Write-Host "git remote add origin https://github.com/yourusername/culinary-leadership-assessment.git"
    exit 1
}

# Step 3: Push to GitHub
Write-Info "Pushing to GitHub..."
try {
    git push origin $currentBranch
    Write-Status "Successfully pushed to GitHub"
} catch {
    Write-Error "Failed to push to GitHub. Please check your credentials and try again."
    exit 1
}

# Step 4: Check environment variables
Write-Info "Checking environment variables..."
if (-not (Test-Path ".env.local")) {
    Write-Warning ".env.local file not found"
    Write-Info "Please create .env.local with the following variables:"
    Write-Host ""
    Get-Content "env.example"
    Write-Host ""
    Read-Host "Press Enter after setting up your environment variables"
}

# Step 5: Generate secrets if needed
Write-Info "Generating secrets for production..."
Write-Host ""
Write-Host "🔐 GENERATED SECRETS FOR RENDER:" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host "BETTER_AUTH_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")"
Write-Host "ENCRYPTION_KEY=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")"
Write-Host "JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")"
Write-Host ""

# Step 6: Display next steps
Write-Info "NEXT STEPS FOR RENDER DEPLOYMENT:"
Write-Host ""
Write-Host "1. 🌐 Go to https://render.com" -ForegroundColor Yellow
Write-Host "2. 🔐 Sign up/Login with your GitHub account" -ForegroundColor Yellow
Write-Host "3. ➕ Click 'New +' → 'Web Service'" -ForegroundColor Yellow
Write-Host "4. 🔗 Connect your GitHub repository: $remoteUrl" -ForegroundColor Yellow
Write-Host "5. ⚙️  Configure the service:" -ForegroundColor Yellow
Write-Host "   - Name: culinary-leadership-assessment" -ForegroundColor White
Write-Host "   - Environment: Node" -ForegroundColor White
Write-Host "   - Build Command: npm install && npm run build" -ForegroundColor White
Write-Host "   - Start Command: node server.js" -ForegroundColor White
Write-Host "6. 🔧 Add environment variables (see generated secrets above)" -ForegroundColor Yellow
Write-Host "7. 🗄️  Create PostgreSQL database service" -ForegroundColor Yellow
Write-Host "8. 🚀 Deploy and test!" -ForegroundColor Yellow
Write-Host ""

# Step 7: Test build locally
Write-Info "Testing build locally..."
try {
    npm run build
    Write-Status "Local build successful! Ready for deployment."
} catch {
    Write-Error "Local build failed. Please fix errors before deploying."
    exit 1
}

Write-Host ""
Write-Status "🎉 Your code is ready for Render deployment!"
Write-Info "Follow the steps above to complete your deployment."
Write-Info "For detailed instructions, see RENDER_DEPLOYMENT_GUIDE.md"
