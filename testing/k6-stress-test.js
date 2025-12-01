import http from "k6/http";
import { check, sleep } from "k6";
import { Rate } from "k6/metrics";

const errorRate = new Rate("errors");

// Stress test - push system to its limits
export const options = {
  stages: [
    { duration: "2m", target: 100 }, // Ramp up to 100 users
    { duration: "5m", target: 200 }, // Ramp up to 200 users
    { duration: "5m", target: 300 }, // Ramp up to 300 users (stress)
    { duration: "5m", target: 400 }, // Ramp up to 400 users (extreme stress)
    { duration: "2m", target: 0 }, // Ramp down to 0
  ],
  thresholds: {
    http_req_duration: ["p(95)<1500"], // 95% requests under 1.5s during stress
    http_req_failed: ["rate<0.2"], // Allow up to 20% errors during stress
    errors: ["rate<0.2"],
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
    sleep(1);
    return;
  }

  const token = loginRes.json("data.token");
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  sleep(0.5);

  // Get articles
  const articlesRes = http.get(`${BASE_URL}/articles?lang=id`);
  check(articlesRes, {
    "articles loaded": (r) => r.status === 200,
  }) || errorRate.add(1);

  sleep(0.5);

  // Get profile
  const profileRes = http.get(`${BASE_URL}/auth/me`, { headers });
  check(profileRes, {
    "profile loaded": (r) => r.status === 200,
  }) || errorRate.add(1);

  sleep(0.5);

  // Get transactions
  const transRes = http.get(`${BASE_URL}/transactions`, { headers });
  check(transRes, {
    "transactions loaded": (r) => r.status === 200,
  }) || errorRate.add(1);

  sleep(1);

  // Simulate transfer (to same account, will fail validation but tests endpoint)
  const transferData = {
    recipientAccountNumber: user.accountNumber || "1001234567890",
    amount: 10000,
    description: `Stress test transfer ${Date.now()}`,
  };

  const transferRes = http.post(
    `${BASE_URL}/transfer`,
    JSON.stringify(transferData),
    { headers }
  );

  check(transferRes, {
    "transfer response received": (r) => r.status !== 500, // Any response except server error
  });

  sleep(1);
}

// Summary handler
export function handleSummary(data) {
  return {
    stdout: textSummary(data, { indent: " ", enableColors: true }),
    "./results/stress-test-summary.json": JSON.stringify(data, null, 2),
    "./results/stress-test-report.txt": textSummary(data, {
      indent: " ",
      enableColors: false,
    }),
  };
}
