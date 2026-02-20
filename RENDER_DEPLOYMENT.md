# Deployment Guide: Job Portal on Render

## Overview
This guide provides step-by-step instructions to deploy the Job Portal on Render, including both backend (Django) and frontend (React) services.

## Prerequisites
1. GitHub repository with your Job Portal code pushed
2. Render account (free tier available at https://render.com)
3. PostgreSQL database on Render

## Step-by-Step Deployment

### Step 1: Push Your Code to GitHub
```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

### Step 2: Create PostgreSQL Database on Render
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **New +** → **PostgreSQL**
3. Enter database details:
   - Name: `job_portal_db`
   - Region: Oregon (or your preference)
   - Plan: Starter (Free)
4. Create database and note the **Connection String**

### Step 3: Deploy Backend Service
1. Go to **New +** → **Web Service**
2. Connect your GitHub repository
3. Configure service:
   - **Name**: `job-portal-backend`
   - **Environment**: `Python 3.11`
   - **Region**: Same as database
   - **Plan**: Starter or higher (depends on needs)
   - **Build Command**: `bash build.sh`
   - **Start Command**: `cd backend && gunicorn config.wsgi:application --bind 0.0.0.0:$PORT`

4. Add Environment Variables:
   - `DEBUG`: `False`
   - `SECRET_KEY`: Generate a strong secret (use Django's `secrets` module)
   - `DATABASE_URL`: Paste the PostgreSQL connection string from Step 2
   - `ALLOWED_HOSTS`: `yourdomain.onrender.com`
   - `CORS_ALLOWED_ORIGINS`: `https://yourdomain.onrender.com` (will update after frontend is deployed)
   - `PYTHON_VERSION`: `3.11`

5. Click **Create Web Service**
6. Wait for deployment (5-10 minutes)
7. Note the backend URL (e.g., `https://job-portal-backend.onrender.com`)

### Step 4: Deploy Frontend Service
1. Go to **New +** → **Static Site**
2. Connect your GitHub repository
3. Configure service:
   - **Name**: `job-portal-frontend`
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/dist`
   - **Branch**: `main`

4. Click **Create Static Site**
5. Wait for deployment (2-5 minutes)
6. Note the frontend URL (e.g., `https://job-portal-frontend.onrender.com`)

### Step 5: Update Environment Variables
1. Go back to **Backend Service**
2. Update environment variables:
   - `CORS_ALLOWED_ORIGINS`: Add frontend URL: `https://job-portal-frontend.onrender.com`
   - `ALLOWED_HOSTS`: Update if you have a custom domain

3. Click **Save Changes** - this triggers a redeploy

### Step 6: Update Frontend API URL
Update your frontend API configuration:

**File**: [src/services/api.js](src/services/api.js)

```javascript
const API_BASE_URL = 
  process.env.NODE_ENV === 'production' 
    ? 'https://job-portal-backend.onrender.com/api' 
    : 'http://localhost:8000/api';

export default axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

Then redeploy frontend:
```bash
git add src/services/api.js
git commit -m "Update backend API URL for production"
git push origin main
```

### Step 7: Initialize Database
1. SSH into your backend service from Render dashboard
2. Run commands:
```bash
python backend/manage.py migrate
python backend/manage.py createsuperuser
python backend/manage.py create_admin  # If you have this script
```

Or use Render's one-time command feature.

### Step 8: Connect Custom Domain (Optional)
1. Go to **Frontend Service** → **Settings** → **Custom Domain**
2. Add your domain and follow DNS setup instructions

## File Structure After Setup
```
Job-Portal/
├── Procfile                 # Web process configuration
├── build.sh                 # Build script for Render
├── render.yaml             # Blueprint for services
├── backend/
│   ├── manage.py
│   ├── requirements.txt
│   └── config/
│       └── settings.py      # Updated for production
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       └── services/
│           └── api.js       # Updated with backend URL
```

## Important Notes

### Database
- Render provides PostgreSQL via `DATABASE_URL`
- Never use SQLite in production
- Render's free tier database can be paused; upgrade if needed

### Static & Media Files
- Static files are handled by WhiteNoise
- For media uploads (resumes): consider AWS S3 or similar cloud storage
- Currently configured for local storage (suitable for small deployments)

### AI/ML Models
- spaCy model (`en_core_web_sm`) is downloaded during build
- Transformers are downloaded on first use (cache them if possible)
- For large models, consider using a separate ML service

### Environment Variables Checklist
- [ ] `DEBUG=False`
- [ ] `SECRET_KEY` (strong, random string)
- [ ] `DATABASE_URL` (from PostgreSQL)
- [ ] `ALLOWED_HOSTS` (your domain)
- [ ] `CORS_ALLOWED_ORIGINS` (frontend URL)
- [ ] `PYTHON_VERSION=3.11`

### Performance Tips
1. Use Render's paid tier for better performance
2. Consider caching for heavy AI/ML operations
3. Use CDN for static assets
4. Monitor database connections

### Troubleshooting

**502 Bad Gateway Error**
- Check backend logs in Render dashboard
- Verify database connection
- Check if migrations were applied

**CORS Errors**
- Verify `CORS_ALLOWED_ORIGINS` includes frontend domain
- Clear browser cache

**Database Connection Issues**
- Verify `DATABASE_URL` is correct
- Check database is running and accessible

**Long Build Times**
- Reduce AI/ML models if not all needed
- Use requirements-prod.txt with only necessary packages

**Media Upload Issues**
- Default: local storage only (development mode)
- For production: set up S3 or similar cloud storage

## Deployment Monitoring
- Monitor logs in Render dashboard
- Set up email notifications for deployment failures
- Use Render's metrics for performance monitoring

## Next Steps
1. Configure media storage (S3, Azure Blob, etc.)
2. Set up SSL certificate (automatic on Render)
3. Enable HTTPS only
4. Configure backup strategy for database
5. Set up CI/CD pipeline for automated deployments

## Useful Links
- Render Documentation: https://render.com/docs
- Django Deployment: https://docs.djangoproject.com/en/4.2/howto/deployment/
- Gunicorn: https://gunicorn.org/
- WhiteNoise: http://whitenoise.evans.io/

---
**Last Updated**: February 2026
**Status**: Production Ready
