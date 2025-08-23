#!/bin/bash

# sllyd GitHub Pages Deployment Script

echo "🚀 Starting sllyd deployment to GitHub Pages..."

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git first."
    exit 1
fi

# Initialize git repository if not already done
if [ ! -d ".git" ]; then
    echo "📁 Initializing git repository..."
    git init
    git add .
    git commit -m "Initial commit: sllyd landing page"
fi

# Check if remote origin exists
if ! git remote get-url origin &> /dev/null; then
    echo "🔗 Please add your GitHub repository as remote origin:"
    echo "   git remote add origin https://github.com/YOUR_USERNAME/sllyd.git"
    echo "   Then run this script again."
    exit 1
fi

# Push to GitHub
echo "📤 Pushing to GitHub..."
git add .
git commit -m "Update: sllyd landing page"
git push -u origin main

echo "✅ Deployment complete!"
echo ""
echo "📋 Next steps:"
echo "1. Go to your GitHub repository"
echo "2. Navigate to Settings > Pages"
echo "3. Set Source to 'Deploy from a branch'"
echo "4. Select 'main' branch and '/' folder"
echo "5. Enter your custom domain: sllyd.com"
echo "6. Check 'Enforce HTTPS'"
echo "7. Click 'Save'"
echo ""
echo "🌐 Configure DNS records as described in DNS_SETUP.md"
echo "⏰ Wait 24-48 hours for DNS propagation"
