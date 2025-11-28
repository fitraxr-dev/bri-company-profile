# Deployment Guide - FastAPI Backend

## Deployment Options

### Option 1: Railway (Recommended for Quick Deploy)

1. **Install Railway CLI** (if not already installed):
```bash
npm install -g @railway/cli
```

2. **Login to Railway**:
```bash
railway login
```

3. **Initialize project**:
```bash
cd backend_fastapi
railway init
```

4. **Add environment variables** in Railway dashboard:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
CORS_ORIGINS=https://your-frontend-domain.com
PORT=5000
```

5. **Create Procfile**:
```
web: uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

6. **Deploy**:
```bash
railway up
```

### Option 2: Heroku

1. **Create Procfile**:
```
web: uvicorn app.main:app --host 0.0.0.0 --port $PORT --workers 4
```

2. **Create runtime.txt**:
```
python-3.11.7
```

3. **Deploy**:
```bash
heroku create your-app-name
heroku config:set MONGODB_URI=your_connection_string
heroku config:set JWT_SECRET=your_secret_key
git push heroku main
```

### Option 3: Docker (Universal)

1. **Create Dockerfile**:
```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "5000"]
```

2. **Create docker-compose.yml** (optional, for local testing):
```yaml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "5000:5000"
    environment:
      - MONGODB_URI=mongodb://mongo:27017/brimo_db
      - JWT_SECRET=your-secret-key
    depends_on:
      - mongo
  
  mongo:
    image: mongo:7
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

volumes:
  mongo_data:
```

3. **Build and run**:
```bash
docker build -t brimo-backend .
docker run -p 5000:5000 -e MONGODB_URI=your_uri brimo-backend
```

### Option 4: AWS EC2 / DigitalOcean / VPS

1. **SSH into your server**:
```bash
ssh user@your-server-ip
```

2. **Install dependencies**:
```bash
sudo apt update
sudo apt install python3 python3-pip python3-venv nginx
```

3. **Clone repository**:
```bash
git clone your-repo-url
cd backend_fastapi
```

4. **Setup virtual environment**:
```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

5. **Create systemd service** (`/etc/systemd/system/brimo-api.service`):
```ini
[Unit]
Description=BRImo FastAPI Application
After=network.target

[Service]
User=www-data
WorkingDirectory=/path/to/backend_fastapi
Environment="PATH=/path/to/backend_fastapi/venv/bin"
ExecStart=/path/to/backend_fastapi/venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 5000 --workers 4

[Install]
WantedBy=multi-user.target
```

6. **Start service**:
```bash
sudo systemctl start brimo-api
sudo systemctl enable brimo-api
```

7. **Configure Nginx** (`/etc/nginx/sites-available/brimo-api`):
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

8. **Enable site**:
```bash
sudo ln -s /etc/nginx/sites-available/brimo-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## Environment Variables for Production

Make sure to set these in your production environment:

```env
# Server
PORT=5000
HOST=0.0.0.0
DEBUG=False

# MongoDB (use MongoDB Atlas or managed service)
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/brimo_db?retryWrites=true&w=majority

# Security
JWT_SECRET=generate-a-very-secure-random-key-here
JWT_ALGORITHM=HS256
JWT_EXPIRES_IN_DAYS=7

# CORS (your frontend URLs)
CORS_ORIGINS=https://your-frontend.com,https://www.your-frontend.com
```

## Security Checklist

- [ ] Change JWT_SECRET to a strong random value
- [ ] Set DEBUG=False in production
- [ ] Use HTTPS (SSL/TLS certificates)
- [ ] Restrict CORS_ORIGINS to your actual frontend domains
- [ ] Use environment variables for all secrets
- [ ] Enable MongoDB authentication
- [ ] Use a managed MongoDB service (Atlas) for production
- [ ] Set up rate limiting (consider using slowapi or similar)
- [ ] Monitor logs and errors
- [ ] Set up backups for MongoDB

## Performance Optimization

### 1. Use Multiple Workers
```bash
uvicorn app.main:app --workers 4 --host 0.0.0.0 --port 5000
```

### 2. Enable Gunicorn (for better process management)
```bash
pip install gunicorn
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:5000
```

### 3. Add Caching (Redis)
```bash
pip install redis aioredis
```

### 4. Database Indexes
Make sure to create proper indexes in MongoDB (see README.md)

## Monitoring

### 1. Application Logs
```bash
# View systemd logs
sudo journalctl -u brimo-api -f

# Docker logs
docker logs -f container_name
```

### 2. Health Checks
Set up monitoring for:
- `/api/ping` endpoint
- MongoDB connection status
- API response times

### 3. Error Tracking
Consider using:
- Sentry
- Rollbar
- New Relic
- DataDog

## Backup Strategy

1. **MongoDB Backups**:
```bash
# Daily backup script
mongodump --uri="mongodb_uri" --out=/backup/$(date +%Y%m%d)
```

2. **Automated Backups**:
   - Use MongoDB Atlas automated backups
   - Set up cron jobs for manual MongoDB instances
   - Store backups in S3 or similar storage

## Scaling

### Horizontal Scaling
- Deploy multiple instances behind a load balancer
- Use managed platforms (Railway, Heroku) for auto-scaling
- Implement session management if needed

### Vertical Scaling
- Increase server resources (CPU, RAM)
- Optimize database queries
- Add caching layer

## Troubleshooting

### High Memory Usage
- Reduce number of workers
- Implement pagination for large datasets
- Add response caching

### Slow Responses
- Add database indexes
- Optimize queries
- Enable connection pooling
- Use caching (Redis)

### Connection Timeouts
- Increase timeout settings
- Check MongoDB connection pool settings
- Verify network connectivity

## Rolling Back

If deployment fails:

1. **Railway/Heroku**: Rollback from dashboard
2. **Docker**: Use previous image tag
3. **Systemd**: Restore from git commit
```bash
git checkout previous-commit
sudo systemctl restart brimo-api
```

## Support

For deployment issues, check:
- Application logs
- MongoDB connection
- Environment variables
- Firewall settings
- DNS configuration
