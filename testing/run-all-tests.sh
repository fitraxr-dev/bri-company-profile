#!/bin/bash

# Script untuk menjalankan semua k6 tests secara berurutan
# Usage: ./run-all-tests.sh [API_URL]

API_URL=${1:-"http://localhost:5000/api"}
RESULTS_DIR="testing/results"

# Create results directory
mkdir -p "$RESULTS_DIR"

echo "=========================================="
echo "Running k6 Load Tests"
echo "API URL: $API_URL"
echo "=========================================="
echo ""

# 1. Smoke Test
echo "📝 Running Smoke Test..."
k6 run -e API_URL="$API_URL" \
  --out json="$RESULTS_DIR/smoke-test-results.json" \
  testing/k6-smoke-test.js

if [ $? -eq 0 ]; then
  echo "✅ Smoke Test PASSED"
else
  echo "❌ Smoke Test FAILED"
  exit 1
fi

echo ""
echo "=========================================="
echo ""

# 2. Load Test
echo "📝 Running Load Test..."
k6 run -e API_URL="$API_URL" \
  --out json="$RESULTS_DIR/load-test-results.json" \
  testing/k6-load-test.js

if [ $? -eq 0 ]; then
  echo "✅ Load Test PASSED"
else
  echo "❌ Load Test FAILED - continuing with other tests..."
fi

echo ""
echo "=========================================="
echo ""

# 3. Spike Test
echo "📝 Running Spike Test..."
k6 run -e API_URL="$API_URL" \
  --out json="$RESULTS_DIR/spike-test-results.json" \
  testing/k6-spike-test.js

if [ $? -eq 0 ]; then
  echo "✅ Spike Test PASSED"
else
  echo "❌ Spike Test FAILED - this is expected under high load"
fi

echo ""
echo "=========================================="
echo ""

# Optional: Stress Test (commented out by default - takes longer)
# echo "📝 Running Stress Test..."
# k6 run -e API_URL="$API_URL" \
#   --out json="$RESULTS_DIR/stress-test-results.json" \
#   testing/k6-stress-test.js

# Optional: Soak Test (commented out by default - takes 30+ minutes)
# echo "📝 Running Soak Test..."
# k6 run -e API_URL="$API_URL" \
#   --out json="$RESULTS_DIR/soak-test-results.json" \
#   testing/k6-soak-test.js

echo ""
echo "=========================================="
echo "All Tests Completed!"
echo "Results saved in: $RESULTS_DIR"
echo "=========================================="
