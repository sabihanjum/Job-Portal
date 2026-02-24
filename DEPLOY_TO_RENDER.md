# Complete Step-by-Step Render Deployment Guide

This guide provides **exact commands** to deploy your Job Portal to Render.

## 📋 Prerequisites

Before starting, ensure you have:
- GitHub account
- Render account (sign up at https://render.com)
- Git installed locally
- Python 3.11+ installed
- Node.js 16+ installed

---

## 🚀 Part 1: Local Preparation

### Step 1: Generate Django Secret Key

Run this command to generate a secure secret key:

```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

**Save this output** - you'll need it as `SECRET_KEY` environment variable.

### Step 2: Test Local Build

Verify everything works locally:

```bash
# Activate virtual environment (Windows)
.venv\Scripts\activate

# Test backend
cd backend
python manage.py check
python manage.py migrate
cd ..

# Test frontend build
cd frontend
npm install
npm run build
cd ..
```

### Step 3: Push Code to GitHub

```bash
# Check git status
git status

# Add all files
git add .

# Commit changes
git commit -m "Ready for Render deployment"

# Push to GitHub
git push origin main
```

---

## 🗄️ Part 2: Create PostgreSQL Database

### Step 4: Create Database on Render

**Via Render Dashboard:**
1. Go to https://dashboard.render.com
2. Click **New +** → **PostgreSQL**
3. Configure:
   - **Name**: `job-portal-db`
   - **Database**: `job_portal_db`
   - **User**: `job_portal_user` (auto-generated)
   - **Region**: Oregon (US-West)
   - **PostgreSQL Version**: 16
   - **Plan**: Starter (Free)
4. Click **Create Database**
5. Wait 2-3 minutes for provisioning
6. **Copy the Internal Database URL** from the database page

**The URL looks like:**
```
postgresql://job_portal_user:password@dpg-xxxxx-a.oregon-postgres.render.com/job_portal_db
```

---

## 🔧 Part 3: Deploy Backend Service

### Step 5: Create Backend Web Service

**Via Render Dashboard:**
1. Click **New +** → **Web Service**
2. Select **Build and deploy from a Git repository**
3. Click **Connect** next to your GitHub repository
4. Configure the service:

**Basic Settings:**
- **Name**: `job-portal-backend`
- **Region**: Oregon (US-West) - **Same as database**
- **Branch**: `main`
- **Root Directory**: (leave blank)
- **Environment**: `Python 3`
- **Build Command**: 
  ```bash
  bash build.sh
  ```
- **Start Command**: 
  ```bash
  cd backend && gunicorn config.wsgi:application --bind 0.0.0.0:$PORT
  ```
- **Plan**: Starter ($7/month recommended) or Free

### Step 6: Add Backend Environment Variables

Click **Advanced** → **Add Environment Variable** and add these:

```bash
# Python version
PYTHON_VERSION=3.11

# Django settings
DEBUG=False
SECRET_KEY=[paste your generated secret key from Step 1]
ALLOWED_HOSTS=job-portal-backend.onrender.com

# Database (paste your database URL from Step 4)
DATABASE_URL=postgresql://job_portal_user:password@dpg-xxxxx-a.oregon-postgres.render.com/job_portal_db

# CORS (we'll update this after frontend deployment)
CORS_ALLOWED_ORIGINS=https://job-portal-backend.onrender.com
```

**Important**: Replace `[paste your generated secret key from Step 1]` with actual secret key!

### Step 7: Deploy Backend

1. Click **Create Web Service**
2. Wait 10-15 minutes for initial build
3. Watch build logs for any errors
4. Once deployed, **copy your backend URL**:
   - Example: `https://job-portal-backend.onrender.com`

### Step 8: Initialize Database (Important!)

Once backend is deployed, you need to create an admin user:

**Via Render Shell:**
1. Go to your backend service in Render Dashboard
2. Click **Shell** tab (top right)
3. Run these commands:

```bash
# Navigate to backend
cd backend

# Create superuser
python manage.py createsuperuser

# Follow prompts:
# Username: admin
# Email: your-email@example.com
# Password: [choose a strong password]
# Password (again): [repeat password]
```

**Alternative: Run create_superuser.py script:**
```bash
cd backend
python ../create_superuser.py
```

---

## 🎨 Part 4: Deploy Frontend Service

### Step 9: Update Frontend API Configuration

Before deploying frontend, update the API URL:

**Edit your local file** `frontend/src/services/api.js` or similar:

```javascript
const API_BASE_URL = 
  process.env.NODE_ENV === 'production' 
    ? 'https://job-portal-backend.onrender.com/api'  // ← Your backend URL
    : 'http://localhost:8000/api';
```

**Commit and push:**
```bash
git add frontend/src/services/api.js
git commit -m "Update API URL for production"
git push origin main
```

### Step 10: Create Frontend Static Site

**Via Render Dashboard:**
1. Click **New +** → **Static Site**
2. Select **Build and deploy from a Git repository**
3. Connect your GitHub repository
4. Configure:

**Basic Settings:**
- **Name**: `job-portal-frontend`
- **Branch**: `main`
- **Root Directory**: (leave blank)
- **Build Command**: 
  ```bash
  cd frontend && npm install && npm run build
  ```
- **Publish Directory**: 
  ```
  frontend/dist
  ```

### Step 11: Deploy Frontend

1. Click **Create Static Site**
2. Wait 5-7 minutes for build
3. Once deployed, **copy your frontend URL**:
   - Example: `https://job-portal-frontend.onrender.com`

---

## 🔗 Part 5: Connect Backend & Frontend

### Step 12: Update Backend CORS Settings

1. Go to **Backend Service** in Render Dashboard
2. Click **Environment** tab
3. Find `CORS_ALLOWED_ORIGINS` variable
4. Update it to include frontend URL:
   ```
   https://job-portal-frontend.onrender.com,https://job-portal-backend.onrender.com
   ```
5. Also update `ALLOWED_HOSTS`:
   ```
   job-portal-backend.onrender.com,job-portal-frontend.onrender.com
   ```
6. Click **Save Changes**
7. This will trigger automatic redeployment (2-3 minutes)

---

## ✅ Part 6: Verification & Testing

### Step 13: Test Backend API

Open these URLs in your browser:

```
# Health check
https://job-portal-backend.onrender.com/

# API root
https://job-portal-backend.onrender.com/api/

# Admin panel
https://job-portal-backend.onrender.com/admin/
```

### Step 14: Test Frontend

Open your frontend URL:
```
https://job-portal-frontend.onrender.com
```

**Test these features:**
- [ ] Home page loads
- [ ] Registration works
- [ ] Login works
- [ ] Dashboard accessible
- [ ] Job listings display
- [ ] Resume upload works
- [ ] No CORS errors in browser console (F12)

### Step 15: Check Logs

If anything doesn't work:

**Backend Logs:**
1. Go to backend service in Render Dashboard
2. Click **Logs** tab
3. Look for errors

**Frontend Logs:**
1. Go to frontend static site in Render Dashboard
2. Click **Logs** tab
3. Check build logs

---

## 🛠️ Common Commands & Troubleshooting

### Re-run Migrations

If you need to apply new migrations:

```bash
# Via Render Shell (Backend Service)
cd backend
python manage.py migrate
```

### Create Sample Data

```bash
# Via Render Shell (Backend Service)
cd backend
python create_sample_jobs.py
```

### View Database

Connect to PostgreSQL:

```bash
# Get connection string from Database → Info → External Database URL
psql [external-database-url]
```

### Force Redeploy

**Backend:**
```bash
# Locally commit any change
git commit --allow-empty -m "Trigger redeploy"
git push origin main

# Or via Dashboard: Manual Deploy → Clear build cache & deploy
```

**Frontend:**
```bash
# Same as backend
git push origin main
```

### Check Environment Variables

```bash
# Via Render Shell (Backend Service)
printenv | grep -E "DEBUG|SECRET_KEY|DATABASE_URL|ALLOWED_HOSTS|CORS"
```

---

## 🔒 Security Checklist

- [x] `DEBUG=False` in production
- [x] Strong unique `SECRET_KEY`
- [x] `ALLOWED_HOSTS` set correctly
- [x] `CORS_ALLOWED_ORIGINS` restricted to your domains
- [x] Database credentials not in code
- [x] `.env` files not committed to Git
- [x] Admin panel secured with strong password

---

## 📊 Monitoring & Maintenance

### Check Service Health

```bash
# Backend health
curl https://job-portal-backend.onrender.com/api/

# Response should be 200 OK
```

### Database Backup

Render automatically backs up PostgreSQL databases. To create manual backup:

1. Go to Database in Render Dashboard
2. Click **Backups** tab
3. Click **Create Backup**

### Update Dependencies

When you update `requirements.txt` or `package.json`:

```bash
# Commit changes
git add .
git commit -m "Update dependencies"
git push origin main

# Render will automatically rebuild
```

---

## 🎯 Quick Reference

### Backend Service URLs

| Endpoint | URL |
|----------|-----|
| API Root | `https://job-portal-backend.onrender.com/api/` |
| Admin Panel | `https://job-portal-backend.onrender.com/admin/` |
| Register | `https://job-portal-backend.onrender.com/api/auth/register/` |
| Login | `https://job-portal-backend.onrender.com/api/auth/login/` |

### Frontend URL

```
https://job-portal-frontend.onrender.com
```

### Database Info

Access from Render Dashboard → PostgreSQL → Info tab

---

## 🆘 Support & Resources

- **Render Documentation**: https://render.com/docs
- **Django Deployment**: https://docs.djangoproject.com/en/4.2/howto/deployment/
- **Render Community**: https://community.render.com

---

## 📝 Post-Deployment Tasks

After successful deployment:

1. **Add Custom Domain** (Optional):
   - Frontend: Static Site → Settings → Custom Domain
   - Backend: Web Service → Settings → Custom Domain
   - Update DNS records as instructed
   - Update `ALLOWED_HOSTS` and `CORS_ALLOWED_ORIGINS`

2. **Set up SSL** (Automatic):
   - Render provides free SSL certificates
   - No action needed if using Render domains

3. **Monitor Performance**:
   - Check Metrics tab in each service
   - Upgrade plan if needed

4. **Enable Auto-Deploy** (Recommended):
   - Settings → Auto-Deploy → Enable
   - Automatically deploys when you push to GitHub

---

## 🔄 Rollback Procedure

If deployment fails:

1. Go to service in Render Dashboard
2. Click **Deploys** tab
3. Find last successful deployment
4. Click **Redeploy**

---

**Deployment Complete! 🎉**

Your Job Portal is now live at:
- Frontend: `https://job-portal-frontend.onrender.com`
- Backend: `https://job-portal-backend.onrender.com`

Share your URLs and start using your application!
