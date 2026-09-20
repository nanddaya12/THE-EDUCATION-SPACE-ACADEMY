# Enterprise ERP Production Deployment Runbook

This guide outlines step-by-step deployment instructions for hosting **The Education Space Academy ERP** in a production environment.

---

## 1. Prerequisites

- **Server Specs**: Linux Ubuntu 22.04 LTS (Minimum 4 vCPU, 8 GB RAM, 50 GB SSD)
- **Node.js**: v20 LTS or v22 LTS
- **Database**: PostgreSQL 15+ (Cloud Managed AWS RDS or Self-Hosted)
- **Web Server**: Nginx (Reverse Proxy & SSL Termination)
- **Process Manager**: PM2 or Docker Containerization
- **SSL Certificate**: Let's Encrypt Certbot or Cloudflare SSL

---

## 2. Server Setup & Repository Cloning

```bash
# Update System Packages
sudo apt update && sudo apt upgrade -y

# Install Node.js 20 LTS & PM2
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs nginx certbot python3-certbot-nginx
sudo npm install -g pm2

# Clone Repository
git clone https://github.com/the-education-space/erp.git /var/www/educationspace-erp
cd /var/www/educationspace-erp

# Install Dependencies
npm ci --only=production
```

---

## 3. Environment Configuration

Create `/var/www/educationspace-erp/.env`:

```env
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://erp_user:ENV_DB_PASSWORD@localhost:5432/educationspace_db?schema=public
JWT_SECRET=ENV_PRODUCTION_SECURE_JWT_SECRET_STRING_2026
JWT_EXPIRES_IN=7d
CORS_ORIGIN=https://educationspace.edu.pk,https://admin.educationspace.edu.pk

# SMTP Mail Configuration
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=ENV_SENDGRID_API_KEY
SMTP_SENDER_EMAIL=noreply@educationspace.edu.pk
```

---

## 4. Production Database Migration

```bash
# Run Prisma Migrations
npx prisma migrate deploy

# Seed Default Production Roles & Admin User
npx prisma db seed
```

---

## 5. Frontend Production Build & PM2 Startup

```bash
# Build Vite Production Frontend
npm run build

# Start Express Backend Service via PM2
pm2 start dist/server/server.js --name "educationspace-erp" -i max
pm2 save
pm2 startup
```

---

## 6. Nginx Reverse Proxy & Security Configuration

Create `/etc/nginx/sites-available/educationspace.conf`:

```nginx
server {
    listen 80;
    server_name educationspace.edu.pk admin.educationspace.edu.pk;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name educationspace.edu.pk admin.educationspace.edu.pk;

    ssl_certificate /etc/letsencrypt/live/educationspace.edu.pk/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/educationspace.edu.pk/privkey.pem;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Serve Vite Frontend Static Assets
    root /var/www/educationspace-erp/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proxy API Requests to Node.js Service
    location /api/ {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# Enable Nginx Configuration & Reload
sudo ln -s /etc/nginx/sites-available/educationspace.conf /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## 7. SSL Certificate Activation

```bash
# Provision Let's Encrypt Certificate
sudo certbot --nginx -d educationspace.edu.pk -d admin.educationspace.edu.pk
```
