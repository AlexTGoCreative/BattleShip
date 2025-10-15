#!/bin/bash

# 🚀 Battleship Game Deployment Script
# This script helps you deploy your Battleship game quickly

echo "🚢 Battleship Game Deployment Script"
echo "======================================"

# Function to deploy to different platforms
deploy_to_render() {
    echo "🏗️ Deploying to Render..."
    echo "1. Make sure you've pushed to GitHub"
    echo "2. Go to render.com and create a new Web Service"
    echo "3. Connect your GitHub repository"
    echo "4. Use these settings:"
    echo "   - Build Command: npm ci && npm run build"
    echo "   - Start Command: npm start"
    echo "   - Environment Variables:"
    echo "     NODE_ENV=production"
    echo "     MONGODB_URI=mongodb+srv://admin:admin123456@construction-ms.t3ekpjd.mongodb.net/?retryWrites=true&w=majority&appName=Construction-MS"
    echo "     PORT=3000"
}

deploy_to_heroku() {
    echo "⚡ Deploying to Heroku..."
    
    # Check if Heroku CLI is installed
    if ! command -v heroku &> /dev/null; then
        echo "❌ Heroku CLI not found. Please install it first:"
        echo "   npm install -g heroku"
        return
    fi
    
    read -p "Enter your Heroku app name: " app_name
    
    echo "🔧 Setting up Heroku app..."
    heroku create $app_name
    
    echo "🔧 Setting environment variables..."
    heroku config:set NODE_ENV=production
    heroku config:set MONGODB_URI="mongodb+srv://admin:admin123456@construction-ms.t3ekpjd.mongodb.net/?retryWrites=true&w=majority&appName=Construction-MS"
    
    echo "📦 Building and deploying..."
    git add .
    git commit -m "Deploy to Heroku"
    git push heroku main
    
    echo "🚀 Opening your app..."
    heroku open
}

prepare_for_deployment() {
    echo "📦 Preparing project for deployment..."
    
    # Build the project
    echo "🔨 Building production version..."
    npm run build
    
    if [ $? -eq 0 ]; then
        echo "✅ Build successful!"
    else
        echo "❌ Build failed. Please check the errors above."
        return
    fi
    
    # Run tests
    echo "🧪 Running tests..."
    npm test -- --passWithNoTests
    
    # Check if git repo is clean
    if [ -n "$(git status --porcelain)" ]; then
        echo "📝 You have uncommitted changes. Committing them..."
        git add .
        git commit -m "Prepare for deployment - $(date)"
    fi
    
    echo "✅ Project ready for deployment!"
}

# Main menu
echo ""
echo "Choose deployment option:"
echo "1) Prepare project for deployment"
echo "2) Deploy to Render (Manual setup required)"
echo "3) Deploy to Heroku (Automated)"
echo "4) Show deployment guide"
echo "5) Exit"

read -p "Enter your choice (1-5): " choice

case $choice in
    1)
        prepare_for_deployment
        ;;
    2)
        prepare_for_deployment
        deploy_to_render
        ;;
    3)
        prepare_for_deployment
        deploy_to_heroku
        ;;
    4)
        echo "📚 Opening deployment guide..."
        if command -v code &> /dev/null; then
            code DEPLOYMENT_GUIDE.md
        else
            echo "Please open DEPLOYMENT_GUIDE.md for detailed instructions"
        fi
        ;;
    5)
        echo "👋 Goodbye!"
        exit 0
        ;;
    *)
        echo "❌ Invalid choice. Please run the script again."
        ;;
esac

echo ""
echo "🎉 Done! Your Battleship game is ready to sail the digital seas!"