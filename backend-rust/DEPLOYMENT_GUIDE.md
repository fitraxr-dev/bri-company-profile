# Deployment Guide

## 🚢 Production Deployment

### Prerequisites
- Server dengan Rust installed (atau build di local)
- MongoDB database (production)
- Domain dengan SSL certificate (recommended)
- Reverse proxy (nginx/caddy) - optional tapi recommended

## Option 1: Deploy dengan Binary

### Step 1: Build Production Binary di Local

```bash
# Build optimized binary
cargo build --release

# Binary ada di: target/release/brimo-backend-rust
# Size: ~10-15MB
```

### Step 2: Copy ke Server

**Windows ke Linux Server:**
```bash
# Cross-compile untuk Linux (install target terlebih dahulu)
rustup target add x86_64-unknown-linux-gnu
cargo build --release --target x86_64-unknown-linux-gnu

# Copy via SCP
scp target/release/brimo-backend-rust user@server:/opt/brimo-backend/
```

**Linux/Mac:**
```bash
scp target/release/brimo-backend-rust user@server:/opt/brimo-backend/
```

### Step 3: Setup Environment di Server

```bash
# SSH ke server
ssh user@server

# Buat directory
sudo mkdir -p /opt/brimo-backend
cd /opt/brimo-backend

# Copy atau buat .env file
sudo nano .env
```

Production `.env`:
```env
PORT=5000
RUST_LOG=warn
MONGODB_URI=mongodb+srv://prod_user:prod_pass@cluster.mongodb.net/brimo_prod
JWT_SECRET=production-secret-key-minimum-64-characters-recommended-use-openssl-rand
JWT_EXPIRES_IN=604800
BCRYPT_COST=12
CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com
```

Generate secure JWT secret:
```bash
openssl rand -hex 64
```

### Step 4: Setup Systemd Service (Linux)

```bash
sudo nano /etc/systemd/system/brimo-backend.service
```

```ini
[Unit]
Description=BRImo Backend API (Rust)
After=network.target

[Service]
Type=simple
User=www-data
Group=www-data
WorkingDirectory=/opt/brimo-backend
Environment=RUST_LOG=info
ExecStart=/opt/brimo-backend/brimo-backend-rust
Restart=on-failure
RestartSec=10
StandardOutput=append:/var/log/brimo-backend/access.log
StandardError=append:/var/log/brimo-backend/error.log

# Security
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ProtectHome=true
ReadWritePaths=/opt/brimo-backend

[Install]
WantedBy=multi-user.target
```

Create log directory:
```bash
sudo mkdir -p /var/log/brimo-backend
sudo chown www-data:www-data /var/log/brimo-backend
```

Set permissions:
```bash
sudo chmod +x /opt/brimo-backend/brimo-backend-rust
sudo chown -R www-data:www-data /opt/brimo-backend
```

Enable and start service:
```bash
sudo systemctl daemon-reload
sudo systemctl enable brimo-backend
sudo systemctl start brimo-backend
sudo systemctl status brimo-backend
```

## Option 2: Deploy dengan Docker

### Dockerfile

Create `Dockerfile`:
```dockerfile
# Build stage
FROM rust:1.75 as builder
WORKDIR /app
COPY Cargo.toml Cargo.lock ./
COPY src ./src
RUN cargo build --release

# Runtime stage
FROM debian:bookworm-slim
RUN apt-get update && apt-get install -y \
    ca-certificates \
    libssl3 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY --from=builder /app/target/release/brimo-backend-rust .
COPY .env .env

EXPOSE 5000
CMD ["./brimo-backend-rust"]
```

### Docker Compose

Create `docker-compose.yml`:
```yaml
version: '3.8'

services:
  backend:
    build: .
    ports:
      - "5000:5000"
    environment:
      - RUST_LOG=info
    env_file:
      - .env
    restart: unless-stopped
    networks:
      - brimo-network

networks:
  brimo-network:
    driver: bridge
```

Build and run:
```bash
docker-compose up -d
```

## Option 3: Deploy ke Cloud Platform

### A. Railway.app

1. Install Railway CLI:
```bash
npm i -g @railway/cli
```

2. Login:
```bash
railway login
```

3. Initialize:
```bash
railway init
```

4. Deploy:
```bash
railway up
```

5. Set environment variables di Railway dashboard

### B. Fly.io

1. Install Fly CLI:
```bash
curl -L https://fly.io/install.sh | sh
```

2. Login:
```bash
fly auth login
```

3. Launch app:
```bash
fly launch
```

4. Deploy:
```bash
fly deploy
```

### C. DigitalOcean App Platform

1. Connect GitHub repository
2. Select Rust buildpack
3. Set environment variables
4. Deploy automatically

### D. AWS EC2

1. Launch EC2 instance (Ubuntu)
2. Install Rust:
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```
3. Clone repo dan build
4. Setup systemd service (lihat Option 1)
5. Configure security groups (port 5000)

## Nginx Reverse Proxy Setup

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable SSL dengan Certbot:
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

## Monitoring & Logging

### Logs dengan journalctl
```bash
# View logs
sudo journalctl -u brimo-backend -f

# Last 100 lines
sudo journalctl -u brimo-backend -n 100

# Filter by time
sudo journalctl -u brimo-backend --since "1 hour ago"
```

### Setup Log Rotation
```bash
sudo nano /etc/logrotate.d/brimo-backend
```

```
/var/log/brimo-backend/*.log {
    daily
    rotate 14
    compress
    delaycompress
    notifempty
    missingok
    create 0640 www-data www-data
}
```

### Health Check Script

Create `health_check.sh`:
```bash
#!/bin/bash
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/api/ping)
if [ $RESPONSE -ne 200 ]; then
    echo "Service is down! Restarting..."
    sudo systemctl restart brimo-backend
    # Send alert
fi
```

Add to crontab:
```bash
crontab -e
# Add: */5 * * * * /opt/brimo-backend/health_check.sh
```

## Performance Tuning

### 1. Increase File Descriptors

```bash
sudo nano /etc/security/limits.conf
```

Add:
```
* soft nofile 65536
* hard nofile 65536
```

### 2. Optimize Systemd Service

Add to service file:
```ini
[Service]
LimitNOFILE=65536
LimitNPROC=4096
```

### 3. MongoDB Connection Pool

Already configured in code, but adjust if needed in `src/db/mod.rs`

## Security Checklist

- [ ] Use HTTPS only (SSL certificate)
- [ ] Strong JWT_SECRET (64+ characters)
- [ ] BCRYPT_COST ≥ 12 for production
- [ ] Firewall configured (only necessary ports)
- [ ] Regular security updates
- [ ] MongoDB authentication enabled
- [ ] MongoDB IP whitelist
- [ ] Rate limiting (use nginx)
- [ ] CORS properly configured
- [ ] No sensitive data in logs
- [ ] Regular backups

## Backup Strategy

### MongoDB Backup
```bash
# Backup
mongodump --uri="mongodb+srv://..." --out=/backup/$(date +%Y%m%d)

# Restore
mongorestore --uri="mongodb+srv://..." /backup/20241124
```

### Automated Backup Script
```bash
#!/bin/bash
BACKUP_DIR="/backup/mongodb"
DATE=$(date +%Y%m%d_%H%M%S)
mongodump --uri="$MONGODB_URI" --out="$BACKUP_DIR/$DATE"
# Delete backups older than 30 days
find $BACKUP_DIR -type d -mtime +30 -exec rm -rf {} +
```

## Rollback Plan

1. Keep previous binary version
2. Backup database before deploy
3. Test in staging first
4. Have rollback script ready

Rollback script:
```bash
#!/bin/bash
sudo systemctl stop brimo-backend
sudo cp /opt/brimo-backend/brimo-backend-rust.backup /opt/brimo-backend/brimo-backend-rust
sudo systemctl start brimo-backend
```

## CI/CD with GitHub Actions

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Install Rust
        uses: actions-rs/toolchain@v1
        with:
          toolchain: stable
      
      - name: Build
        run: cargo build --release
      
      - name: Deploy to Server
        uses: appleboy/scp-action@master
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_KEY }}
          source: "target/release/brimo-backend-rust"
          target: "/opt/brimo-backend/"
      
      - name: Restart Service
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            sudo systemctl restart brimo-backend
```

## Troubleshooting

### Service won't start
```bash
# Check status
sudo systemctl status brimo-backend

# View logs
sudo journalctl -u brimo-backend -n 50

# Check permissions
ls -la /opt/brimo-backend/
```

### High CPU usage
- Check MongoDB slow queries
- Review log level (use `warn` in production)
- Consider horizontal scaling

### Memory leak
- Rust generally doesn't have memory leaks
- Check MongoDB connection pooling
- Monitor with `htop` or `systemd-cgtop`

## Performance Benchmarks

Expected production performance:
- Requests/sec: 50k-100k (depending on endpoint)
- Memory usage: 10-20MB
- CPU usage: <5% at 1k req/sec
- Response time: <5ms (avg)

---

**Questions?** Check logs, documentation, or create an issue!
