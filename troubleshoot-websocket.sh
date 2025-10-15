#!/bin/bash

# 🔍 Battleship WebSocket Troubleshooting Script
echo "🔍 Battleship WebSocket Connection Troubleshooting"
echo "=================================================="

echo ""
echo "🚨 If you're seeing 'websocket error' after deployment:"
echo ""

echo "1️⃣ PUSH THE ENVIRONMENT FIX:"
echo "   git add ."
echo "   git commit -m \"Fix environment detection for production\""
echo "   git push origin main"
echo ""

echo "2️⃣ WAIT FOR RENDER TO REDEPLOY (5-10 minutes)"
echo ""

echo "3️⃣ TEST YOUR DEPLOYED APP:"
read -p "   Enter your Render URL (e.g., https://battleship-game-xxxx.onrender.com): " render_url

if [ -n "$render_url" ]; then
    echo ""
    echo "🔍 Testing health endpoint..."
    curl -s "$render_url/health" | python -m json.tool 2>/dev/null || echo "❌ Health check failed or not JSON response"
    
    echo ""
    echo "🌐 Open this URL in your browser:"
    echo "   $render_url"
    echo ""
    echo "📋 In browser console (F12), you should see:"
    echo "   🌍 Environment: production"
    echo "   🔌 Connecting to server: $render_url"
    echo ""
    echo "❌ If you see localhost URLs, clear browser cache and refresh"
fi

echo ""
echo "4️⃣ COMMON SOLUTIONS:"
echo "   ✅ Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)"
echo "   ✅ Clear browser cache"
echo "   ✅ Try incognito/private browsing"
echo "   ✅ Check Render logs for any errors"
echo ""

echo "5️⃣ VERIFY ENVIRONMENT DETECTION:"
echo "   In browser console, look for:"
echo "   🌍 Environment: production"
echo "   hostname: your-app-name.onrender.com"
echo "   origin: https://your-app-name.onrender.com"
echo ""

echo "✅ If environment shows 'production' and URLs are correct, WebSocket should work!"
echo ""
echo "📞 Still having issues? Check the deployment logs on Render dashboard."