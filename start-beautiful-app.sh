#!/bin/bash

echo "🎨 Starting Beautiful Vacation Management System..."

# Kill any existing processes
pkill -f "node.*index.js" 2>/dev/null
pkill -f "npm start" 2>/dev/null
pkill -f "webpack" 2>/dev/null

echo "📦 Starting Backend Server..."
cd Backend
node dist/index.js &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

echo "🎨 Starting Beautiful React Frontend..."
cd ../Frontend
npm start &
FRONTEND_PID=$!

echo ""
echo "🎉 Your Beautiful Vacation Management System is Starting!"
echo ""
echo "✅ Backend: http://localhost:3001"
echo "✅ Frontend: http://localhost:3000"
echo ""
echo "🌟 Features:"
echo "   • Beautiful gradient backgrounds"
echo "   • Modern card designs with hover effects"
echo "   • Responsive layout"
echo "   • Interactive animations"
echo "   • Professional UI/UX"
echo ""
echo "🔑 Login Credentials:"
echo "   • Admin: admin@vacation.com / admin123"
echo "   • User: john.doe@email.com / password123"
echo ""
echo "📱 The app will open automatically in your browser!"
echo "   Press Ctrl+C to stop both servers"

# Open the app in browser
sleep 5
open http://localhost:3000

# Wait for user to stop
wait

# Cleanup
kill $BACKEND_PID 2>/dev/null
kill $FRONTEND_PID 2>/dev/null
echo "🛑 Servers stopped"
