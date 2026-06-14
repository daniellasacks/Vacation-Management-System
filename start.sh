#!/bin/bash

echo "Starting Vacation Management System..."

# Check if MySQL is running
if ! pgrep -x "mysqld" > /dev/null; then
    echo "Please start MySQL server first"
    exit 1
fi

# Start backend
echo "Starting backend server..."
cd Backend
npm install
npm run dev &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start frontend
echo "Starting frontend server..."
cd ../Frontend
npm install
npm start &
FRONTEND_PID=$!

echo "Both servers are starting..."
echo "Backend: http://localhost:3001"
echo "Frontend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for user to stop
wait

# Cleanup
kill $BACKEND_PID 2>/dev/null
kill $FRONTEND_PID 2>/dev/null
echo "Servers stopped"
