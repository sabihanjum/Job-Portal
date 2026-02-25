# Render Deployment - Quick Command Reference

All commands you need for Render deployment, ready to copy and paste.

---

## 🔧 Pre-Deployment Commands (Run Locally)

### Generate Django Secret Key
```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

### Test Local Build
```bash
# Activate virtual environment (Windows)
.venv\Scripts\activate

# Test backend
cd backend
python manage.py check
python manage.py migrate
cd ..

# Test frontend
cd frontend
npm install
npm run build
cd ..
```

### Push to GitHub
```bash
git status
git add .
git commit -m "Ready for Render deployment"
git push origin main
```

---

## 🌐 Render Dashboard Configuration

### Backend Web Service Settings

**Build Command:**
```bash
bash build.sh
```

**Start Command:**
```bash
cd backend && gunicorn config.wsgi:application --bind 0.0.0.0:$PORT
```

**Environment Variables:**
```bash
PYTHON_VERSION=3.11.8
DEBUG=False
SECRET_KEY=[your-generated-secret-key]
ALLOWED_HOSTS=job-portal-backend.onrender.com
DATABASE_URL=[your-postgresql-connection-string]
CORS_ALLOWED_ORIGINS=https://job-portal-backend.onrender.com
DJANGO_SUPERUSER_CREATE=true
DJANGO_SUPERUSER_USERNAME=admin
DJANGO_SUPERUSER_EMAIL=admin@jobportal.com
DJANGO_SUPERUSER_PASSWORD=[your-strong-password]
```

### Frontend Static Site Settings

**Build Command:**
```bash
cd frontend && npm install && npm run build
```

**Publish Directory:**
```
frontend/dist
```

---

## 💻 Render Shell Commands (After Deployment)

Access via: Render Dashboard → Your Service → Shell Tab

### Create Superuser
```bash
cd backend
python manage.py createsuperuser
```

### Create Superuser Without Shell (Free plan)
```bash
# Set env vars in Render Dashboard, then redeploy
DJANGO_SUPERUSER_CREATE=true
DJANGO_SUPERUSER_USERNAME=admin
DJANGO_SUPERUSER_EMAIL=admin@jobportal.com
DJANGO_SUPERUSER_PASSWORD=[your-strong-password]
```

### Run Migrations
```bash
cd backend
python manage.py migrate
```

### Create Sample Data
```bash
cd backend
python create_sample_jobs.py
```

### Check Django Setup
```bash
cd backend
python manage.py check
```

### View Environment Variables
```bash
printenv | grep -E "DEBUG|SECRET_KEY|DATABASE_URL|ALLOWED_HOSTS|CORS"
```

### Collect Static Files (if needed)
```bash
cd backend
python manage.py collectstatic --noinput
```

---

## 🗄️ Database Commands

### Connect to PostgreSQL
```bash
# Get External Database URL from Render Dashboard
psql [your-external-database-url]
```

### Common SQL Commands
```sql
-- List tables
\dt

-- View users
SELECT * FROM authentication_customuser;

-- View jobs
SELECT * FROM jobs_job;

-- Exit
\q
```

---

## 🔄 Update & Redeploy Commands

### Update Code and Redeploy
```bash
# Make your changes, then:
git add .
git commit -m "Update: describe your changes"
git push origin main

# Render will auto-deploy if enabled
```

### Force Redeploy (empty commit)
```bash
git commit --allow-empty -m "Trigger redeploy"
git push origin main
```

---

## 🧪 Testing Commands

### Test Backend API (curl)
```bash
# Health check
curl https://job-portal-backend.onrender.com/

# API root
curl https://job-portal-backend.onrender.com/api/

# Test registration
curl -X POST https://job-portal-backend.onrender.com/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"testpass123","user_type":"job_seeker"}'
```

### Test with PowerShell (Windows)
```powershell
# Health check
Invoke-WebRequest -Uri "https://job-portal-backend.onrender.com/api/" -Method GET

# Test registration
$body = @{
    username = "testuser"
    email = "test@example.com"
    password = "testpass123"
    user_type = "job_seeker"
} | ConvertTo-Json

Invoke-WebRequest -Uri "https://job-portal-backend.onrender.com/api/auth/register/" `
  -Method POST `
  -Body $body `
  -ContentType "application/json"
```

---

## 📊 Monitoring Commands

### View Service Logs
```bash
# Via Render Dashboard:
# Your Service → Logs tab

# Look for errors related to:
# - Database connections
# - CORS issues
# - Static files
# - Import errors
```

### Check Service Status
```bash
# Via curl
curl -I https://job-portal-backend.onrender.com/api/

# Should return: HTTP/2 200
```

---

## 🔧 Troubleshooting Commands

### Clear Build Cache
```bash
# Via Render Dashboard:
# Your Service → Manual Deploy → Clear build cache & deploy
```

### Check Disk Usage
```bash
# Via Render Shell
df -h
```

### Check Python/Node Versions
```bash
# Via Render Shell
python --version
node --version
npm --version
```

### Test Database Connection
```bash
# Via Render Shell
cd backend
python manage.py dbshell
```

### View Django Settings
```bash
# Via Render Shell
cd backend
python manage.py diffsettings
```

---

## 🔐 Security Commands

### Change Admin Password
```bash
# Via Render Shell
cd backend
python manage.py changepassword admin
```

### Create Additional Superuser
```bash
# Via Render Shell
cd backend
python manage.py createsuperuser
```

---

## 🚀 Production Management Commands

### Scale Service (via Dashboard)
```
Your Service → Settings → Instance Type
```

### Enable Auto-Deploy
```
Your Service → Settings → Auto-Deploy → On
```

### Add Custom Domain
```
Static Site → Settings → Custom Domain → Add
```

---

## 📋 Environment Variable Updates

### Update via Render Dashboard
```
1. Your Service → Environment Tab
2. Edit variable
3. Click "Save Changes"
4. Service auto-redeploys
```

### Update via Render Blueprint (render.yaml)
```yaml
# Edit render.yaml locally, then:
git add render.yaml
git commit -m "Update environment variables"
git push origin main
```

---

## 🎯 Quick Start Sequence

```bash
# 1. Generate secret
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"

# 2. Push code
git add .
git commit -m "Deploy to Render"
git push origin main

# 3. Create services on Render Dashboard (PostgreSQL + Backend + Frontend)

# 4. After backend deploys, create superuser via Shell:
cd backend
python manage.py createsuperuser

# 5. Update CORS in backend environment variables with frontend URL

# Done! 🎉
```

---

## 📞 Support

If commands fail, check:
1. **Logs**: Service → Logs tab
2. **Build Logs**: Service → Events tab
3. **Environment Variables**: Service → Environment tab
4. **Database Connection**: Database → Info tab

---

**Last Updated**: February 24, 2026
