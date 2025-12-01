# Load Testing dengan Grafana k6

Panduan untuk melakukan load testing pada BRI Company Profile API menggunakan Grafana k6.

## Prerequisites

### Instalasi k6

**Windows:**

```powershell
# Menggunakan Chocolatey
choco install k6

# Atau download dari https://k6.io/docs/get-started/installation/
```

**macOS:**

```bash
brew install k6
```

**Linux:**

```bash
# Debian/Ubuntu
sudo gpg -k
sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt-get update
sudo apt-get install k6
```

## Jenis Testing

### 1. Smoke Test

**Tujuan:** Verifikasi dasar bahwa sistem berjalan dengan benar
**File:** `k6-smoke-test.js`
**Beban:** 1 user selama 30 detik

```bash
k6 run testing/k6-smoke-test.js
```

### 2. Load Test

**Tujuan:** Menguji performa sistem dengan beban normal dan tinggi
**File:** `k6-load-test.js`
**Beban:** Bertahap dari 10 hingga 100 concurrent users

```bash
k6 run testing/k6-load-test.js
```

### 3. Stress Test

**Tujuan:** Menemukan batas maksimal sistem
**File:** `k6-stress-test.js`
**Beban:** Bertahap hingga 400 concurrent users

```bash
k6 run testing/k6-stress-test.js
```

### 4. Spike Test

**Tujuan:** Menguji respon sistem terhadap lonjakan trafik mendadak
**File:** `k6-spike-test.js`
**Beban:** Lonjakan tiba-tiba dari 10 ke 500 users

```bash
k6 run testing/k6-spike-test.js
```

### 5. Soak Test

**Tujuan:** Menguji stabilitas sistem dalam jangka waktu lama (memory leaks, resource exhaustion)
**File:** `k6-soak-test.js`
**Beban:** 50 users konsisten selama 30 menit

```bash
k6 run testing/k6-soak-test.js
```

## Konfigurasi Environment

### Menggunakan Backend Lokal

```bash
k6 run testing/k6-load-test.js
# Default: http://localhost:5001/api
```

### Menggunakan Custom API URL

```bash
k6 run -e API_URL=http://localhost:5000/api testing/k6-load-test.js
```

### Menggunakan Production URL

```bash
k6 run -e API_URL=https://your-api.com/api testing/k6-load-test.js
```

## Output dan Reporting

### Console Output (Default)

```bash
k6 run testing/k6-load-test.js
```

### JSON Output

```bash
k6 run --out json=results.json testing/k6-load-test.js
```

### HTML Report (dengan k6-reporter)

```bash
# Install extension
npm install -g k6-to-junit

# Run dengan output
k6 run --out json=results.json testing/k6-load-test.js
```

### InfluxDB + Grafana (Real-time Monitoring)

```bash
# Run dengan output ke InfluxDB
k6 run --out influxdb=http://localhost:8086/k6 testing/k6-load-test.js
```

### Cloud Monitoring (k6 Cloud)

```bash
# Login
k6 login cloud

# Run dengan cloud output
k6 run --out cloud testing/k6-load-test.js
```

## Interpretasi Hasil

### Metrics Penting

**http_req_duration**: Waktu response time

- p(95) < 500ms: Excellent
- p(95) < 1000ms: Good
- p(95) > 1000ms: Needs optimization

**http_req_failed**: Error rate

- < 1%: Excellent
- < 5%: Acceptable
- > 10%: Critical

**http_reqs**: Request throughput

- Higher is better (requests per second)

**vus (Virtual Users)**: Concurrent users

- Target load based on test scenario

### Thresholds

Setiap test memiliki threshold yang berbeda:

```javascript
thresholds: {
  http_req_duration: ['p(95)<500'],  // 95% request < 500ms
  http_req_failed: ['rate<0.1'],      // Error rate < 10%
}
```

Jika threshold tidak tercapai, test akan **FAIL** dengan exit code 1.

## Skenario Testing yang Tersedia

### Load Test (k6-load-test.js)

1. Health Check (`/api/ping`)
2. Authentication (`/api/auth/login`)
3. Get Articles (`/api/articles`)
4. Get Stock Data (`/api/stock/bbri`)
5. Get User Profile (`/api/auth/profile`)
6. Get Transactions (`/api/transactions`)

### Test Users

```javascript
- admin@brimo.com / password123 (Admin)
- ahmad.fadli@example.com / password123 (User)
- siti.rahmawati@example.com / password123 (User)
```

## Best Practices

### 1. Mulai dengan Smoke Test

Selalu jalankan smoke test dulu sebelum load test yang lebih besar.

### 2. Persiapkan Data

Pastikan database sudah di-seed dengan data yang cukup.

### 3. Monitor Resources

Pantau CPU, Memory, dan Disk I/O server saat testing.

### 4. Isolasi Environment

Jangan run load test di production tanpa persiapan.

### 5. Incremental Testing

Mulai dari beban kecil, naikkan bertahap.

## Troubleshooting

### Error: Connection Refused

```
Server tidak running atau URL salah
→ Cek apakah server berjalan di port yang benar
```

### Error: Too Many Failed Requests

```
Server tidak mampu handle beban
→ Turunkan target VUs atau optimalkan backend
```

### Error: ECONNRESET / ETIMEDOUT

```
Network issues atau server timeout
→ Cek network configuration dan server capacity
```

## Integrasi CI/CD

### GitHub Actions

```yaml
name: Load Test
on: [push]
jobs:
  load-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: grafana/k6-action@v0.3.0
        with:
          filename: testing/k6-smoke-test.js
```

### GitLab CI

```yaml
load-test:
  image: grafana/k6:latest
  script:
    - k6 run testing/k6-smoke-test.js
```

## Contoh Output

```
     ✓ ping is status 200
     ✓ login is status 200
     ✓ articles is status 200

     checks.........................: 100.00% ✓ 1500      ✗ 0
     data_received..................: 3.2 MB  53 kB/s
     data_sent......................: 890 kB  15 kB/s
     http_req_blocked...............: avg=1.23ms   min=0s   med=0s    max=98.32ms  p(90)=0s      p(95)=0s
     http_req_connecting............: avg=1.15ms   min=0s   med=0s    max=97.43ms  p(90)=0s      p(95)=0s
   ✓ http_req_duration..............: avg=156.32ms min=45ms med=142ms max=1.23s    p(90)=245ms   p(95)=298ms
     http_req_failed................: 0.00%   ✓ 0         ✗ 1500
     http_req_receiving.............: avg=0.45ms   min=0s   med=0s    max=23.21ms  p(90)=1ms     p(95)=2ms
     http_req_sending...............: avg=0.12ms   min=0s   med=0s    max=8.76ms   p(90)=0s      p(95)=0s
     http_req_tls_handshaking.......: avg=0s       min=0s   med=0s    max=0s       p(90)=0s      p(95)=0s
     http_req_waiting...............: avg=155.75ms min=44ms med=141ms max=1.22s    p(90)=244ms   p(95)=297ms
     http_reqs......................: 1500    25/s
     iteration_duration.............: avg=2.34s    min=2s   med=2.3s  max=3.45s    p(90)=2.67s   p(95)=2.89s
     iterations.....................: 500     8.33/s
     vus............................: 10      min=10      max=10
     vus_max........................: 10      min=10      max=10
```

## Resources

- [k6 Documentation](https://k6.io/docs/)
- [k6 Examples](https://k6.io/docs/examples/)
- [k6 Cloud](https://k6.io/cloud/)
- [Grafana k6 GitHub](https://github.com/grafana/k6)
