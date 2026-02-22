#!/bin/bash
# Start both backend services in separate terminals

echo "Starting Axxess Heart Health Backend Services..."
echo ""

# Start CVD Prediction API on port 5001
echo "Starting CVD Prediction API on port 5001..."
python main.py &
CVD_PID=$!

# Wait a moment for CVD service to start
sleep 2

# Start LLM Feedback Service on port 5000
echo "Starting LLM Feedback Service on port 5000..."
node llm.js &
LLM_PID=$!

echo ""
echo "✅ All services started!"
echo "   - CVD API: http://localhost:5001"
echo "   - LLM Service: http://localhost:5000"
echo ""
echo "PIDs: CVD=$CVD_PID, LLM=$LLM_PID"
echo "To stop services, run: kill $CVD_PID $LLM_PID"

wait
