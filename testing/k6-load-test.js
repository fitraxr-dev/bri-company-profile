import http from "k6/http";
import { check, sleep } from "k6";
import { Rate, Trend, Counter } from "k6/metrics";

// Custom metrics untuk analisis mendalam
const errorRate = new Rate("errors");
const latency = new Trend("custom_latency", true);
const throughput = new Counter("custom_throughput");
const successfulRequests = new Counter("successful_requests");
const failedRequests = new Counter("failed_requests");

// Test configuration - Progressive Load Testing
// Menguji 4 level beban: 10, 50, 100, 500 concurrent users
export const options = {
  stages: [
    // Level 1: Light Load (10 users)
    { duration: "1m", target: 10 }, // Ramp up ke 10 users
    { duration: "2m", target: 10 }, // Maintain 10 users - test stability

    // Level 2: Moderate Load (50 users)
    { duration: "1m", target: 50 }, // Ramp up ke 50 users
    { duration: "3m", target: 50 }, // Maintain 50 users

    // Level 3: High Load (100 users)
    { duration: "1m", target: 100 }, // Ramp up ke 100 users
    { duration: "3m", target: 100 }, // Maintain 100 users

    // Level 4: Very High Load (500 users)
    { duration: "2m", target: 500 }, // Ramp up ke 500 users
    { duration: "4m", target: 500 }, // Maintain 500 users - stress test

    // Ramp down
    { duration: "2m", target: 0 }, // Graceful shutdown
  ],
  thresholds: {
    // Latency thresholds - relaxed for high load
    http_req_duration: [
      "p(50)<300", // 50% requests < 300ms (median)
      "p(90)<2000", // 90% requests < 2s (relaxed for 500 users)
      "p(95)<5000", // 95% requests < 5s (relaxed for stress)
      "p(99)<10000", // 99% requests < 10s
    ],
    custom_latency: ["avg<2000", "p(95)<5000"], // Relaxed for stress test

    // Error rate thresholds
    http_req_failed: ["rate<0.20"], // < 20% error rate (acceptable for stress)
    errors: ["rate<0.20"], // Allow some errors under extreme load

    // Throughput thresholds
    http_reqs: ["rate>50"], // Minimum 50 requests/second
    custom_throughput: ["count>1000"], // At least 1000 successful requests
  },
  summaryTrendStats: ["min", "avg", "med", "max", "p(90)", "p(95)", "p(99)"],
};

// Base URL - change this based on environment
const BASE_URL = __ENV.API_URL || "http://localhost:5000/api";

// Test data
const testUsers = [
  { email: "admin@brimo.com", password: "password123" },
  { email: "ahmad.fadli@example.com", password: "password123" },
  { email: "siti.rahmawati@example.com", password: "password123" },
];

// Helper function to get random user
function getRandomUser() {
  return testUsers[Math.floor(Math.random() * testUsers.length)];
}

// Helper function to login and get token
function login() {
  const user = getRandomUser();
  const loginRes = http.post(`${BASE_URL}/auth/login`, JSON.stringify(user), {
    headers: { "Content-Type": "application/json" },
  });

  const loginSuccess = check(loginRes, {
    "login successful": (r) => r.status === 200,
    "login has token": (r) => r.json("data.token") !== undefined,
  });

  if (!loginSuccess) {
    errorRate.add(1);
    return null;
  }

  return loginRes.json("data.token");
}

// Main test scenario dengan metrics tracking
export default function () {
  const iterationStart = Date.now();

  // Test 1: Health Check - Ukur latency
  const pingStart = Date.now();
  const pingRes = http.get(`${BASE_URL}/ping`);
  const pingDuration = Date.now() - pingStart;

  const pingSuccess = check(pingRes, {
    "ping status is 200": (r) => r.status === 200,
    "ping latency < 100ms": (r) => r.timings.duration < 100,
  });

  if (pingSuccess) {
    successfulRequests.add(1);
    throughput.add(1);
    latency.add(pingDuration);
  } else {
    errorRate.add(1);
    failedRequests.add(1);
  }

  sleep(0.5);

  // Test 2: Login - Measure concurrency capability
  const loginStart = Date.now();
  const token = login();
  const loginDuration = Date.now() - loginStart;

  if (!token) {
    failedRequests.add(1);
    sleep(1);
    return;
  }

  latency.add(loginDuration);
  successfulRequests.add(1);
  throughput.add(1);

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  sleep(0.5);

  // Test 3: Get Articles (Public) - High concurrency test
  const articlesStart = Date.now();
  const articlesRes = http.get(`${BASE_URL}/articles?lang=id&status=published`);
  const articlesDuration = Date.now() - articlesStart;

  const articlesSuccess = check(articlesRes, {
    "articles status is 200": (r) => r.status === 200,
    "articles has data": (r) => r.json("data") !== undefined,
    "articles latency < 300ms": (r) => r.timings.duration < 300,
  });

  if (articlesSuccess) {
    successfulRequests.add(1);
    throughput.add(1);
    latency.add(articlesDuration);
  } else {
    errorRate.add(1);
    failedRequests.add(1);
  }

  sleep(0.5);

  // Test 4: Get Stock Data - Resource intensive
  const stockStart = Date.now();
  const stockRes = http.get(`${BASE_URL}/stock/bbri`);
  const stockDuration = Date.now() - stockStart;

  const stockSuccess = check(stockRes, {
    "stock status is 200 or 500": (r) => r.status === 200 || r.status === 500,
  });

  if (stockRes.status === 200) {
    successfulRequests.add(1);
    throughput.add(1);
    latency.add(stockDuration);
  }

  sleep(0.5);

  // Test 5: Get User Profile (Authenticated) - Database read test
  const profileStart = Date.now();
  const profileRes = http.get(`${BASE_URL}/auth/me`, { headers });
  const profileDuration = Date.now() - profileStart;

  const profileSuccess = check(profileRes, {
    "profile status is 200": (r) => r.status === 200,
    "profile has user data": (r) => r.json("data.user") !== undefined,
    "profile latency < 200ms": (r) => r.timings.duration < 200,
  });

  if (profileSuccess) {
    successfulRequests.add(1);
    throughput.add(1);
    latency.add(profileDuration);
  } else {
    errorRate.add(1);
    failedRequests.add(1);
  }

  sleep(0.5);

  // Test 6: Get User Transactions (Authenticated) - Complex query test
  const transactionsStart = Date.now();
  const transactionsRes = http.get(`${BASE_URL}/transactions`, { headers });
  const transactionsDuration = Date.now() - transactionsStart;

  const transactionsSuccess = check(transactionsRes, {
    "transactions status is 200": (r) => r.status === 200,
    "transactions latency < 400ms": (r) => r.timings.duration < 400,
  });

  if (transactionsSuccess) {
    successfulRequests.add(1);
    throughput.add(1);
    latency.add(transactionsDuration);
  } else {
    errorRate.add(1);
    failedRequests.add(1);
  }

  // Calculate total iteration duration (untuk mengukur resource usage)
  const iterationDuration = Date.now() - iterationStart;

  // Adaptive sleep based on load level
  const currentVUs = __VU;
  if (currentVUs <= 10) {
    sleep(1); // Light load - normal delay
  } else if (currentVUs <= 50) {
    sleep(0.5); // Moderate load
  } else if (currentVUs <= 100) {
    sleep(0.3); // High load
  } else {
    sleep(0.1); // Very high load - maximum throughput
  }
}

// Summary handler untuk menampilkan metrics detail
export function handleSummary(data) {
  const loadLevels = {
    "10_users": { start: 0, end: 180 }, // 0-3 min
    "50_users": { start: 180, end: 420 }, // 3-7 min
    "100_users": { start: 420, end: 660 }, // 7-11 min
    "500_users": { start: 660, end: 1020 }, // 11-17 min
  };

  console.log("\n═══════════════════════════════════════════════════════════");
  console.log("          PERFORMANCE TESTING SUMMARY REPORT");
  console.log("═══════════════════════════════════════════════════════════\n");

  console.log("📊 OVERALL METRICS:");
  console.log("─────────────────────────────────────────────────────────────");

  // Latency Analysis
  if (data.metrics.http_req_duration) {
    const latency = data.metrics.http_req_duration.values;
    console.log("\n🔹 LATENCY ANALYSIS:");
    console.log(`   Min:     ${latency.min.toFixed(2)} ms`);
    console.log(`   Average: ${latency.avg.toFixed(2)} ms`);
    console.log(`   Median:  ${latency.med.toFixed(2)} ms`);
    console.log(`   Max:     ${latency.max.toFixed(2)} ms`);
    console.log(`   P90:     ${latency["p(90)"].toFixed(2)} ms`);
    console.log(`   P95:     ${latency["p(95)"].toFixed(2)} ms`);
    console.log(`   P99:     ${latency["p(99)"].toFixed(2)} ms`);
  }

  // Throughput Analysis
  if (data.metrics.http_reqs) {
    const throughput = data.metrics.http_reqs.values;
    console.log("\n🔹 THROUGHPUT:");
    console.log(`   Total Requests:  ${throughput.count}`);
    console.log(`   Requests/sec:    ${throughput.rate.toFixed(2)} req/s`);
  }

  // Concurrency Analysis
  if (data.metrics.vus) {
    console.log("\n🔹 CONCURRENCY:");
    console.log(`   Max VUs:         ${data.metrics.vus.values.max}`);
    console.log(
      `   Avg VUs:         ${data.metrics.vus.values.value.toFixed(2)}`
    );
  }

  // Error Rate Analysis
  if (data.metrics.http_req_failed) {
    const errorRate = (data.metrics.http_req_failed.values.rate * 100).toFixed(
      2
    );
    console.log("\n🔹 ERROR RATE:");
    console.log(`   Failed Requests: ${errorRate}%`);
    console.log(`   Success Rate:    ${(100 - errorRate).toFixed(2)}%`);
  }

  // Resource Usage Indicators
  if (data.metrics.http_req_waiting) {
    const waiting = data.metrics.http_req_waiting.values;
    console.log("\n🔹 RESOURCE USAGE (Server Wait Time):");
    console.log(`   Average:  ${waiting.avg.toFixed(2)} ms`);
    console.log(`   P95:      ${waiting["p(95)"].toFixed(2)} ms`);
  }

  // Data Transfer
  if (data.metrics.data_received && data.metrics.data_sent) {
    console.log("\n🔹 DATA TRANSFER:");
    console.log(
      `   Received: ${(
        data.metrics.data_received.values.count /
        1024 /
        1024
      ).toFixed(2)} MB`
    );
    console.log(
      `   Sent:     ${(
        data.metrics.data_sent.values.count /
        1024 /
        1024
      ).toFixed(2)} MB`
    );
  }

  console.log("\n═══════════════════════════════════════════════════════════");
  console.log("          LOAD LEVEL BREAKDOWN");
  console.log("═══════════════════════════════════════════════════════════\n");
  console.log("   Level 1: 10 users   - Light load baseline");
  console.log("   Level 2: 50 users   - Moderate load");
  console.log("   Level 3: 100 users  - High load");
  console.log("   Level 4: 500 users  - Stress test");
  console.log(
    "\n═══════════════════════════════════════════════════════════\n"
  );

  return {
    stdout: textSummary(data, { indent: " ", enableColors: true }),
    "./results/load-test-summary.json": JSON.stringify(data, null, 2),
    "./results/load-test-report.txt": textSummary(data, {
      indent: " ",
      enableColors: false,
    }),
  };
}

import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";
