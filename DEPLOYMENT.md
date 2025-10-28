# Production Deployment Guide
## MGNREGA District Performance Portal

This guide covers deploying the MGNREGA portal to a production VPS/VM.

---

## 🎯 Prerequisites

- Ubuntu 20.04+ / Debian 11+ VPS
- Minimum 2 CPU cores
- Minimum 2GB RAM
- 20GB storage
- Root or sudo access
- Domain name (optional but recommended)

---

## 📋 Step-by-Step Deployment

### 1. Initial Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install essential packages
sudo apt install -y curl wget git ufw

# Configure firewall
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### 2. Install Docker

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker --version
docker-compose --version

# Logout and login again for group changes to take effect
```

### 3. Clone Repository

```bash
# Create application directory
mkdir -p /opt/mgnrega
cd /opt/mgnrega

# Clone repository
git clone <your-repository-url> .

# OR upload files via SCP
scp -r "Govt Task" user@your-vps-ip:/opt/mgnrega/
```

### 4. Configure Environment

```bash
# Backend environment
cd /opt/mgnrega/backend
cat > .env << EOF
DATABASE_URL=sqlite+aiosqlite:///./data/mgnrega.db
API_KEY=579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b
CORS_ORIGINS=http://your-vps-ip,http://yourdomain.com
CACHE_EXPIRY_HOURS=24
EOF

# Frontend environment (if using env variables)
cd /opt/mgnrega/frontend
cat > .env << EOF
VITE_API_URL=http://your-vps-ip:8000/api
EOF
```

### 5. Deploy with Docker Compose

```bash
cd /opt/mgnrega

# Build and start services
docker-compose up -d --build

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

### 6. Verify Deployment

```bash
# Test backend
curl http://localhost:8000/
curl http://localhost:8000/api/districts

# Test frontend
curl http://localhost/

# Check container health
docker-compose ps
docker inspect mgnrega-backend | grep Health
```

### 7. Setup Nginx Reverse Proxy (Optional)

If you want to use a custom domain and SSL:

```bash
# Install Nginx
sudo apt install nginx -y

# Create Nginx configuration
sudo tee /etc/nginx/sites-available/mgnrega << EOF
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:80;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    location /api {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Enable site
sudo ln -s /etc/nginx/sites-available/mgnrega /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 8. Setup SSL with Let's Encrypt

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal is set up automatically
# Test renewal
sudo certbot renew --dry-run
```

### 9. Setup Automatic Backups

```bash
# Create backup script
sudo tee /opt/mgnrega/backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/opt/mgnrega/backups"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Backup database
docker exec mgnrega-backend sqlite3 /app/data/mgnrega.db ".backup '/app/data/backup-$DATE.db'"
docker cp mgnrega-backend:/app/data/backup-$DATE.db $BACKUP_DIR/

# Keep only last 7 days of backups
find $BACKUP_DIR -name "backup-*.db" -mtime +7 -delete

echo "Backup completed: backup-$DATE.db"
EOF

# Make executable
sudo chmod +x /opt/mgnrega/backup.sh

# Add to cron (runs daily at 2 AM)
(crontab -l 2>/dev/null; echo "0 2 * * * /opt/mgnrega/backup.sh >> /var/log/mgnrega-backup.log 2>&1") | crontab -
```

### 10. Setup Monitoring

```bash
# Create monitoring script
sudo tee /opt/mgnrega/monitor.sh << 'EOF'
#!/bin/bash

# Check if containers are running
if ! docker-compose -f /opt/mgnrega/docker-compose.yml ps | grep -q "Up"; then
    echo "Container down! Restarting..."
    cd /opt/mgnrega
    docker-compose restart
    
    # Send alert (optional - configure email)
    echo "MGNREGA containers restarted at $(date)" | mail -s "MGNREGA Alert" admin@yourdomain.com
fi
EOF

sudo chmod +x /opt/mgnrega/monitor.sh

# Add to cron (runs every 5 minutes)
(crontab -l 2>/dev/null; echo "*/5 * * * * /opt/mgnrega/monitor.sh >> /var/log/mgnrega-monitor.log 2>&1") | crontab -
```

### 11. Setup Log Rotation

```bash
sudo tee /etc/logrotate.d/mgnrega << EOF
/var/log/mgnrega-*.log {
    daily
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 root root
}
EOF
```

### 12. Performance Tuning

```bash
# Increase Docker logging limits
sudo tee /etc/docker/daemon.json << EOF
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}
EOF

sudo systemctl restart docker
cd /opt/mgnrega
docker-compose restart
```

---

## 🔄 Updating the Application

```bash
cd /opt/mgnrega

# Pull latest changes
git pull origin main

# Rebuild and restart
docker-compose down
docker-compose up -d --build

# Or for zero-downtime update
docker-compose build
docker-compose up -d --no-deps --build backend
docker-compose up -d --no-deps --build frontend
```

---

## 🔍 Monitoring & Maintenance

### View Logs
```bash
# All logs
docker-compose logs -f

# Backend only
docker-compose logs -f backend

# Frontend only
docker-compose logs -f frontend

# Last 100 lines
docker-compose logs --tail=100
```

### Check Resource Usage
```bash
# Container stats
docker stats

# Disk usage
docker system df

# Clean up unused resources
docker system prune -a
```

### Database Maintenance
```bash
# Backup database
docker exec mgnrega-backend sqlite3 /app/data/mgnrega.db ".backup '/app/data/backup.db'"

# Copy backup to host
docker cp mgnrega-backend:/app/data/backup.db ./mgnrega-backup.db

# Restore database
docker cp mgnrega-backup.db mgnrega-backend:/app/data/restore.db
docker exec mgnrega-backend sh -c "sqlite3 /app/data/mgnrega.db '.restore /app/data/restore.db'"
```

---

## 🚨 Troubleshooting

### Application not accessible
```bash
# Check if containers are running
docker-compose ps

# Check firewall
sudo ufw status

# Check port binding
sudo netstat -tulpn | grep :80
sudo netstat -tulpn | grep :8000
```

### High resource usage
```bash
# Check container resources
docker stats

# Restart containers
docker-compose restart

# Clean up Docker
docker system prune -a
```

### Database issues
```bash
# Check database file
docker exec mgnrega-backend ls -lh /app/data/

# Reset database
docker-compose down -v
docker-compose up -d
```

---

## 📊 Performance Optimization

### Enable Caching
```nginx
# Add to nginx configuration
location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### Enable Compression
```nginx
# Add to nginx configuration
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;
```

### Database Optimization
```bash
# For SQLite, enable WAL mode
docker exec mgnrega-backend sqlite3 /app/data/mgnrega.db "PRAGMA journal_mode=WAL;"

# Vacuum database monthly
docker exec mgnrega-backend sqlite3 /app/data/mgnrega.db "VACUUM;"
```

---

## 🔐 Security Hardening

### Limit Docker API Access
```bash
# Configure Docker daemon to listen only on Unix socket
sudo systemctl edit docker.service
# Add: Environment="DOCKER_OPTS=-H unix:///var/run/docker.sock"
```

### Setup Fail2Ban
```bash
sudo apt install fail2ban -y
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

### Regular Security Updates
```bash
# Create update script
cat > /opt/mgnrega/security-update.sh << 'EOF'
#!/bin/bash
apt update
apt upgrade -y
docker pull python:3.11-slim
docker pull node:18-alpine
docker pull nginx:alpine
cd /opt/mgnrega
docker-compose up -d --build
EOF

chmod +x /opt/mgnrega/security-update.sh

# Run weekly
(crontab -l 2>/dev/null; echo "0 3 * * 0 /opt/mgnrega/security-update.sh") | crontab -
```

---

## 📈 Scaling

### Horizontal Scaling
```bash
# Scale backend instances
docker-compose up -d --scale backend=3

# Use nginx load balancer
# Update nginx.conf with upstream configuration
```

### Database Migration to PostgreSQL
```yaml
# Add to docker-compose.yml
services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: mgnrega
      POSTGRES_USER: mgnrega
      POSTGRES_PASSWORD: secure_password
    volumes:
      - postgres-data:/var/lib/postgresql/data
    restart: unless-stopped

volumes:
  postgres-data:
```

---

## ✅ Post-Deployment Checklist

- [ ] Application accessible via browser
- [ ] API endpoints responding correctly
- [ ] SSL certificate installed and working
- [ ] Automatic backups configured
- [ ] Monitoring scripts running
- [ ] Log rotation configured
- [ ] Firewall rules in place
- [ ] Domain DNS configured
- [ ] Health checks passing
- [ ] Performance metrics acceptable

---

## 📞 Support

For deployment issues:
1. Check logs: `docker-compose logs -f`
2. Check container status: `docker-compose ps`
3. Check system resources: `htop` or `docker stats`
4. Review this guide
5. Create an issue on GitHub

---

**Happy Deploying! 🚀**

