@echo off
echo 🚀 Starting sllyd deployment to GitHub Pages...

REM Check if git is installed
git --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Git is not installed. Please install Git first.
    pause
    exit /b 1
)

REM Initialize git repository if not already done
if not exist ".git" (
    echo 📁 Initializing git repository...
    git init
    git add .
    git commit -m "Initial commit: sllyd landing page"
)

REM Check if remote origin exists
git remote get-url origin >nul 2>&1
if errorlevel 1 (
    echo 🔗 Please add your GitHub repository as remote origin:
    echo    git remote add origin https://github.com/YOUR_USERNAME/sllyd.git
    echo    Then run this script again.
    pause
    exit /b 1
)

REM Push to GitHub
echo 📤 Pushing to GitHub...
git add .
git commit -m "Update: sllyd landing page"
git push -u origin main

echo ✅ Deployment complete!
echo.
echo 📋 Next steps:
echo 1. Go to your GitHub repository
echo 2. Navigate to Settings ^> Pages
echo 3. Set Source to 'Deploy from a branch'
echo 4. Select 'main' branch and '/' folder
echo 5. Enter your custom domain: sllyd.com
echo 6. Check 'Enforce HTTPS'
echo 7. Click 'Save'
echo.
echo 🌐 Configure DNS records as described in DNS_SETUP.md
echo ⏰ Wait 24-48 hours for DNS propagation
pause
