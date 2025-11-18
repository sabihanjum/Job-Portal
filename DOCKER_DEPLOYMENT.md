# Docker Deployment Guide - AI-Powered Job Portal

## Deploy Both Frontend & Backend Together with Docker

---

## Prerequisites

1. Install Docker Desktop: https://www.docker.com/products/docker-desktop/
2. Install Docker Compose (included with Docker Desktop)
3. Ensure Docker is running

---

## Quick Start (3 Commands!)

```bash
# 1. Build containers
docker-compose build

# 2. Start all services
docker-compose up -d

# 3. Access your app
# Frontend: http://localhost
# Backend: http://localhost:8000
# Admin: http://localhost:8000/admin
```

That's it! Your entire application is running! 🎉

---

## Detailed Steps

### Step 1: Verify Docker Installation

```bash
docker --version
docker-compose --version
```

### Step 2: Build Docker Images

```bash
# Build all services
docker-compose build

# Or build individually
docker-compose build backend
docker-compose build frontend
```

### Step 3: Start Services

```bash
# Start all services in background
docker-compose up -d

# Or start with logs visible
docker-compose up

# Check running containers
docker-compose ps
```

### Step 4: Create Admin User

```bash
# Create superuser
docker-compose exec backend python manage.py createsuperuser

# Or use the script
docker-compose exec backend python set_admin_password.py
```

### Step 5: Add Sample Data

```bash
# Create sample jobs
docker-compose exec backend python create_sample_jobs.py

# Create sample audit logs
docker-compose exec backend python create_sample_audit_logs.py
```

---

## Access Your Application

- **Frontend:** http://localhost
- **Backend API:** http://localhost:8000/api/
- **Admin Panel:** http://localhost:8000/admin/
- **Database:** localhost:5432

### Default Credentials:
- **Admin:** username: `admin`, password: `admin123`
- **Recruiter:** username: `recruiter1`, password: `recruiter123`

---

## Docker Commands Reference

### Container Management

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# Restart services
docker-compose restart

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Check status
docker-compose ps
```

### Database Management

```bash
# Access PostgreSQL
docker-compose exec db psql -U jobportal_user -d job_portal

# Backup database
docker-compose exec db pg_dump -U jobportal_user job_portal > backup.sql

# Restore database
docker-compose exec -T db psql -U jobportal_user job_portal < backup.sql

# Run migrations
docker-compose exec backend python manage.py migrate

# Create migrations
docker-compose exec backend python manage.py makemigrations
```

### Debugging

```bash
# Enter backend container
docker-compose exec backend bash

# Enter frontend container
docker-compose exec frontend sh

# View container details
docker inspect job_portal_backend

# Remove all containers and volumes
docker-compose down -v
```

---

## Environment Variables

### Update `docker-compose.yml` for production:

```yaml
backend:
  environment:
    - DEBUG=False
    - SECRET_KEY=your-production-secret-key
    - ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
    - DATABASE_URL=postgresql://user:pass@db:5432/job_portal

frontend:
  environment:
    - VITE_API_URL=https://yourdomain.com/api
```

---

## Deploy to Cloud with Docker

### Option 1: Deploy to Railway with Docker

1. Install Railway CLI:
```bash
npm install -g @railway/cli
```

2. Login and deploy:
```bash
railway login
railway init
railway up
```

3. Railway will detect `docker-compose.yml` and deploy!

### Option 2: Deploy to Render with Docker

1. Go to https://render.com/
2. Create "New Web Service"
3. Connect GitHub repository
4. Choose "Docker"
5. Render will use your Dockerfile
6. Deploy!

### Option 3: Deploy to DigitalOcean App Platform

1. Go to https://cloud.digitalocean.com/
2. Create "New App"
3. Connect GitHub
4. Select "Dockerfile"
5. Configure and deploy

### Option 4: Deploy to AWS ECS

1. Push images to ECR
2. Create ECS cluster
3. Define task definitions
4. Deploy services

---

## Production Optimization

### 1. Multi-Stage Builds (Already Implemented!)

Frontend Dockerfile uses multi-stage build:
- Stage 1: Build React app
- Stage 2: Serve with Nginx (smaller image)

### 2. Use Production Database

Update `docker-compose.yml`:
```yaml
environment:
  - DATABASE_URL=postgresql://user:pass@your-db-host:5432/dbname
```

### 3. Add Redis for Caching

```yaml
redis:
  image: redis:7-alpine
  ports:
    - "6379:6379"
```

### 4. Use Docker Secrets

```yaml
secrets:
  db_password:
    file: ./secrets/db_password.txt
```

---

## Docker Compose Commands

### Development

```bash
# Start with build
docker-compose up --build

# Start specific service
docker-compose up backend

# Scale services
docker-compose up --scale backend=3

# View resource usage
docker stats
```

### Production

```bash
# Build for production
docker-compose -f docker-compose.prod.yml build

# Deploy
docker-compose -f docker-compose.prod.yml up -d

# Update services
docker-compose pull
docker-compose up -d
```

---

## Troubleshooting

### Issue 1: Port already in use

```bash
# Stop conflicting services
docker-compose down

# Or change ports in docker-compose.yml
ports:
  - "3000:80"  # Change 80 to 3000
```

### Issue 2: Database connection failed

```bash
# Check database is running
docker-compose ps

# Check logs
docker-compose logs db

# Restart database
docker-compose restart db
```

### Issue 3: Build fails

```bash
# Clean build
docker-compose down -v
docker-compose build --no-cache
docker-compose up
```

### Issue 4: Frontend can't reach backend

```bash
# Check network
docker network ls
docker network inspect job_portal_network

# Verify backend is running
curl http://localhost:8000/api/
```

---

## File Structure

```
AI Powered Job Portal/
├── docker-compose.yml          # Main orchestration file
├── backend/
│   ├── Dockerfile             # Backend container config
│   ├── requirements.txt       # Python dependencies
│   └── ...
├── frontend/
│   ├── Dockerfile             # Frontend container config
│   ├── nginx.conf             # Nginx configuration
│   ├── package.json           # Node dependencies
│   └── ...
└── .gitignore
```

---

## Benefits of Docker Deployment

✅ **Consistency:** Same environment everywhere
✅ **Isolation:** No dependency conflicts
✅ **Portability:** Deploy anywhere
✅ **Scalability:** Easy to scale services
✅ **Easy Setup:** One command to start everything
✅ **Version Control:** Infrastructure as code

---

## Performance Tips

1. **Use .dockerignore:**
```
node_modules
venv
__pycache__
*.pyc
.git
.env
```

2. **Optimize Images:**
- Use Alpine Linux (smaller)
- Multi-stage builds
- Layer caching

3. **Resource Limits:**
```yaml
deploy:
  resources:
    limits:
      cpus: '0.5'
      memory: 512M
```

---

## Monitoring

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend

# Last 100 lines
docker-compose logs --tail=100 backend
```

### Health Checks

```bash
# Check container health
docker-compose ps

# Inspect container
docker inspect job_portal_backend
```

---

## Backup & Restore

### Backup

```bash
# Backup database
docker-compose exec db pg_dump -U jobportal_user job_portal > backup_$(date +%Y%m%d).sql

# Backup volumes
docker run --rm -v job_portal_postgres_data:/data -v $(pwd):/backup alpine tar czf /backup/db_backup.tar.gz /data
```

### Restore

```bash
# Restore database
docker-compose exec -T db psql -U jobportal_user job_portal < backup_20251115.sql
```

---

## Update & Maintenance

### Update Application

```bash
# Pull latest code
git pull

# Rebuild and restart
docker-compose down
docker-compose build
docker-compose up -d

# Or use one command
docker-compose up -d --build
```

### Clean Up

```bash
# Remove stopped containers
docker-compose down

# Remove volumes (⚠️ deletes data)
docker-compose down -v

# Remove unused images
docker image prune -a

# Clean everything
docker system prune -a --volumes
```

---

## Deploy to Production

### Using Docker on VPS (DigitalOcean, AWS, etc.)

1. **SSH into your server:**
```bash
ssh user@your-server-ip
```

2. **Install Docker:**
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
```

3. **Clone repository:**
```bash
git clone https://github.com/sabihanjum/Job-Portal.git
cd Job-Portal
```

4. **Update environment variables in docker-compose.yml**

5. **Deploy:**
```bash
docker-compose up -d --build
```

6. **Setup domain and SSL:**
```bash
# Install Nginx and Certbot
sudo apt install nginx certbot python3-certbot-nginx

# Configure Nginx as reverse proxy
# Get SSL certificate
sudo certbot --nginx -d yourdomain.com
```

---

## Cost Comparison

### Self-Hosted (VPS):
- **DigitalOcean Droplet:** $6/month (1GB RAM)
- **AWS Lightsail:** $5/month
- **Linode:** $5/month

### Managed Docker:
- **Railway:** $5 credit/month (free tier)
- **Render:** Free tier available
- **Fly.io:** Free tier available

---

## Quick Commands Summary

```bash
# Start everything
docker-compose up -d

# Stop everything
docker-compose down

# View logs
docker-compose logs -f

# Rebuild
docker-compose up -d --build

# Access backend shell
docker-compose exec backend python manage.py shell

# Run tests
docker-compose exec backend python manage.py test

# Create superuser
docker-compose exec backend python manage.py createsuperuser
```

---

## Success! 🎉

Your AI-Powered Job Portal is now running in Docker!

**Access:**
- Frontend: http://localhost
- Backend: http://localhost:8000
- Admin: http://localhost:8000/admin

**Next Steps:**
1. Test all features
2. Deploy to production server
3. Set up domain and SSL
4. Configure monitoring

Happy Deploying! 🚀
