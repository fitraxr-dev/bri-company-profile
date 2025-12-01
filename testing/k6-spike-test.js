import http from "k6/http";
import { check, sleep } from "k6";
import { Rate } from "k6/metrics";

const errorRate = new Rate("errors");

// Spike test - sudden surge of traffic
export const options = {
  stages: [
    { duration: "30s", target: 10 }, // Normal load
    { duration: "10s", target: 500 }, // Sudden spike to 500 users
    { duration: "1m", target: 500 }, // Stay at spike
    { duration: "10s", target: 10 }, // Drop back to normal
    { duration: "30s", target: 10 }, // Normal load
    { duration: "10s", target: 0 }, // Ramp down
  ],
  thresholds: {
    http_req_duration: ["p(95)<2000"], // Allow 2s during spike
    http_req_failed: ["rate<0.3"], // Allow 30% errors during spike
    errors: ["rate<0.3"],
  },
};

const BASE_URL = __ENV.API_URL || "http://localhost:5000/api";

export default function () {
  // Test public endpoints during spike
  const pingRes = http.get(`${BASE_URL}/ping`);
  check(pingRes, {
    "ping responded": (r) => r.status === 200,
  }) || errorRate.add(1);

  sleep(0.3);

  const articlesRes = http.get(`${BASE_URL}/articles?lang=id&status=published`);
  check(articlesRes, {
    "articles responded": (r) => r.status === 200,
  }) || errorRate.add(1);

  sleep(0.5);

  // Test auth during spike
  const loginRes = http.post(
    `${BASE_URL}/auth/login`,
    JSON.stringify({
      email: "admin@brimo.com",
      password: "password123",
    }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );

  check(loginRes, {
    "login responded": (r) => r.status === 200 || r.status === 401,
  }) || errorRate.add(1);

  sleep(0.5);
}

// Summary handler
export function handleSummary(data) {
  return {
    stdout: textSummary(data, { indent: " ", enableColors: true }),
    "./results/spike-test-summary.json": JSON.stringify(data, null, 2),
    "./results/spike-test-report.txt": textSummary(data, {
      indent: " ",
      enableColors: false,
    }),
  };
}
