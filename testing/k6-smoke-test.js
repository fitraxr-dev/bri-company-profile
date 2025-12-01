import http from "k6/http";
import { check, sleep } from "k6";
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";

// Smoke test - minimal load to verify system works
export const options = {
  vus: 1, // 1 virtual user
  duration: "30s", // Run for 30 seconds
  thresholds: {
    http_req_duration: ["p(95)<1000"], // 95% requests should be under 1s
    http_req_failed: ["rate<0.05"], // Less than 5% errors
  },
};

const BASE_URL = __ENV.API_URL || "http://localhost:5000/api";

export default function () {
  // Test health endpoint
  const pingRes = http.get(`${BASE_URL}/ping`);
  check(pingRes, {
    "ping is status 200": (r) => r.status === 200,
    "ping has timestamp": (r) => r.json("timestamp") !== undefined,
  });

  sleep(1);

  // Test login
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

  const loginCheck = check(loginRes, {
    "login is status 200": (r) => r.status === 200,
    "login returns token": (r) => r.json("data.token") !== undefined,
  });

  if (loginCheck) {
    const token = loginRes.json("data.token");

    // Test authenticated endpoint
    const profileRes = http.get(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    check(profileRes, {
      "profile is status 200": (r) => r.status === 200,
      "profile has user": (r) => r.json("data.user") !== undefined,
    });
  }

  sleep(1);

  // Test public articles
  const articlesRes = http.get(`${BASE_URL}/articles?lang=id&status=published`);
  check(articlesRes, {
    "articles is status 200": (r) => r.status === 200,
    "articles returns array": (r) => Array.isArray(r.json("data")),
  });

  sleep(2);
}

// Summary handler
export function handleSummary(data) {
  return {
    stdout: textSummary(data, { indent: " ", enableColors: true }),
    "./results/smoke-test-summary.json": JSON.stringify(data, null, 2),
    "./results/smoke-test-report.txt": textSummary(data, {
      indent: " ",
      enableColors: false,
    }),
  };
}
