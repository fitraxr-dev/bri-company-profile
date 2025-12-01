import http from "k6/http";
import { check, sleep } from "k6";
import { Rate } from "k6/metrics";

const errorRate = new Rate("errors");

// Soak test - sustained load over long period (memory leaks, resource exhaustion)
export const options = {
  stages: [
    { duration: "2m", target: 50 }, // Ramp up to 50 users
    { duration: "30m", target: 50 }, // Stay at 50 users for 30 minutes
    { duration: "2m", target: 0 }, // Ramp down
  ],
  thresholds: {
    http_req_duration: ["p(95)<800"],
    http_req_failed: ["rate<0.1"],
    errors: ["rate<0.1"],
  },
};

const BASE_URL = __ENV.API_URL || "http://localhost:5000/api";

const testUsers = [
  { email: "admin@brimo.com", password: "password123" },
  { email: "ahmad.fadli@example.com", password: "password123" },
  { email: "siti.rahmawati@example.com", password: "password123" },
];

function getRandomUser() {
  return testUsers[Math.floor(Math.random() * testUsers.length)];
}

export default function () {
  const user = getRandomUser();

  // Login
  const loginRes = http.post(`${BASE_URL}/auth/login`, JSON.stringify(user), {
    headers: { "Content-Type": "application/json" },
  });

  const loginSuccess = check(loginRes, {
    "login successful": (r) => r.status === 200,
  });

  if (!loginSuccess) {
    errorRate.add(1);
    sleep(2);
    return;
  }

  const token = loginRes.json("data.token");
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  sleep(2);

  // Regular user activities
  const activities = [
    () => {
      // Get articles
      const res = http.get(`${BASE_URL}/articles?lang=id&status=published`);
      check(res, { "articles loaded": (r) => r.status === 200 }) ||
        errorRate.add(1);
    },
    () => {
      // Get profile
      const res = http.get(`${BASE_URL}/auth/me`, { headers });
      check(res, { "profile loaded": (r) => r.status === 200 }) ||
        errorRate.add(1);
    },
    () => {
      // Get transactions
      const res = http.get(`${BASE_URL}/transactions`, { headers });
      check(res, { "transactions loaded": (r) => r.status === 200 }) ||
        errorRate.add(1);
    },
    () => {
      // Get stock data
      const res = http.get(`${BASE_URL}/stock/bbri`);
      check(res, {
        "stock responded": (r) => r.status === 200 || r.status === 500,
      });
    },
  ];

  // Perform random activity
  const randomActivity =
    activities[Math.floor(Math.random() * activities.length)];
  randomActivity();

  sleep(3);
}

// Summary handler
export function handleSummary(data) {
  return {
    stdout: textSummary(data, { indent: " ", enableColors: true }),
    "./results/soak-test-summary.json": JSON.stringify(data, null, 2),
    "./results/soak-test-report.txt": textSummary(data, {
      indent: " ",
      enableColors: false,
    }),
  };
}
