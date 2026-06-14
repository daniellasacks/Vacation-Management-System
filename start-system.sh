#!/bin/bash

echo "🚀 Starting Vacation Management System..."

# Kill any existing processes
echo "Cleaning up existing processes..."
pkill -f "nodemon" 2>/dev/null
pkill -f "ts-node" 2>/dev/null
pkill -f "webpack" 2>/dev/null

# Wait a moment
sleep 2

# Start backend
echo "Starting backend server..."
cd Backend
npm run dev &
BACKEND_PID=$!

# Wait for backend to start
sleep 5

# Start frontend
echo "Starting frontend server..."
cd ../Frontend
npm start &
FRONTEND_PID=$!

# Wait for frontend to start
sleep 8

echo "✅ System started successfully!"
echo "Backend: http://localhost:3001"
echo "Frontend: http://localhost:3000"
echo ""
echo "Opening browser..."
open http://localhost:3000

echo ""
echo "Press Ctrl+C to stop all servers"
wait
