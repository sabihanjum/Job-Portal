# AI-Powered Job Portal - Deployment Guide

## Deployment Architecture

Since this is a full-stack application with:
- **Frontend:** React + Vite
- **Backend:** Django + Python

You'll need to deploy them separately:
- **Frontend:** Vercel (recommended)
- **Backend:** Railway, Render, or PythonAnywhere

---

## Option 1: Deploy Frontend on Vercel + Backend on Railway (RECOMMENDED)

### Part A: Deploy Backend on Railway

#### Step 1: Prepare Backend for Deployment

1. **Create `railway.json` in backend folder:**
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "python manage.py migrate && gunicorn config.wsgi:application",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

2. **Update `backend/requirements.txt` - Add these:**
```txt
gunicorn==21.2.0
whitenoise==6.6.0
dj-database-url==2.1.0
psycopg2-binary==2.9.9
```

3. **Update `backend/config/settings.py`:**
```python
import dj_database_url

# Add at the top after imports
ALLOWED_HOSTS = ['*']  # Update with your domain later

# Update DATABASES section
DATABASES = {
    'default': dj_database_url.config(
        default='sqlite:///db.sqlite3',
        conn_max_age=600
    )
}

# Add WhiteNoise for static files
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',  # Add this
    # ... rest of middleware
]

# Static files
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'
```

#### Step 2: Deploy to Railway

1. Go to https://railway.app/
2. Sign up/Login with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Choose the `backend` folder as root
6. Add environment variables:
   - `SECRET_KEY`: your-secret-key
   - `DEBUG`: False
   - `ALLOWED_HOSTS`: your-domain.railway.app
7. Deploy!
8. Note your backend URL: `https://your-app.railway.app`

---

### Part B: Deploy Frontend on Vercel

#### Step 1: Prepare Frontend

1. **Create `vercel.json` in frontend folder:**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

2. **Update `frontend/src/services/api.js`:**
```javascript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})
```

3. **Create `.env` file in frontend:**
```env
VITE_API_URL=https://your-backend.railway.app/api
```

#### Step 2: Deploy to Vercel

**Method 1: Using Vercel CLI (Recommended)**

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Navigate to frontend folder:
```bash
cd frontend
```

3. Login to Vercel:
```bash
vercel login
```

4. Deploy:
```bash
vercel
```

5. Follow prompts:
   - Set up and deploy? Yes
   - Which scope? Your account
   - Link to existing project? No
   - Project name? ai-job-portal
   - Directory? ./
   - Override settings? No

6. Add environment variable:
```bash
vercel env add VITE_API_URL
```
Enter: `https://your-backend.railway.app/api`

7. Deploy to production:
```bash
vercel --prod
```

**Method 2: Using Vercel Dashboard**

1. Go to https://vercel.com/
2. Sign up/Login with GitHub
3. Click "Add New" → "Project"
4. Import your GitHub repository
5. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** frontend
   - **Build Command:** `npm run build`
   - **Output Directory:** dist
6. Add Environment Variable:
   - Name: `VITE_API_URL`
   - Value: `https://your-backend.railway.app/api`
7. Click "Deploy"

---

## Option 2: Deploy Both on Render

### Step 1: Deploy Backend on Render

1. Go to https://render.com/
2. Sign up/Login
3. Click "New" → "Web Service"
4. Connect your GitHub repository
5. Configure:
   - **Name:** ai-job-portal-backend
   - **Root Directory:** backend
   - **Environment:** Python 3
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `gunicorn config.wsgi:application`
6. Add environment variables
7. Create PostgreSQL database (optional)
8. Deploy

### Step 2: Deploy Frontend on Render

1. Click "New" → "Static Site"
2. Connect repository
3. Configure:
   - **Name:** ai-job-portal-frontend
   - **Root Directory:** frontend
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** dist
4. Add environment variable: `VITE_API_URL`
5. Deploy

---

## Post-Deployment Checklist

### Backend Configuration

1. **Update CORS settings in `backend/config/settings.py`:**
```python
CORS_ALLOWED_ORIGINS = [
    'https://your-frontend.vercel.app',
    'http://localhost:3000',  # for local development
]
```

2. **Update ALLOWED_HOSTS:**
```python
ALLOWED_HOSTS = [
    'your-backend.railway.app',
    'localhost',
    '127.0.0.1',
]
```

3. **Run migrations on production:**
```bash
# On Railway, this happens automatically
# Or use Railway CLI:
railway run python manage.py migrate
```

4. **Create superuser:**
```bash
railway run python manage.py createsuperuser
```

### Frontend Configuration

1. **Update API URL in production**
2. **Test all features**
3. **Check browser console for errors**

---

## Environment Variables Summary

### Backend (Railway/Render)
```
SECRET_KEY=your-secret-key-here
DEBUG=False
ALLOWED_HOSTS=your-domain.railway.app
DATABASE_URL=postgresql://... (auto-provided by Railway)
```

### Frontend (Vercel)
```
VITE_API_URL=https://your-backend.railway.app/api
```

---

## Custom Domain Setup

### For Vercel (Frontend)
1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

### For Railway (Backend)
1. Go to Project Settings → Domains
2. Add custom domain
3. Update DNS records

---

## Troubleshooting

### Common Issues

**1. CORS Errors**
- Update `CORS_ALLOWED_ORIGINS` in backend settings
- Ensure frontend URL is whitelisted

**2. Static Files Not Loading**
- Run `python manage.py collectstatic`
- Check WhiteNoise configuration

**3. Database Connection Issues**
- Verify DATABASE_URL environment variable
- Check PostgreSQL connection

**4. Build Failures**
- Check build logs
- Verify all dependencies in requirements.txt/package.json
- Ensure Python/Node versions are compatible

**5. API Not Responding**
- Check backend logs
- Verify VITE_API_URL is correct
- Test API endpoints directly

---

## Monitoring & Maintenance

### Logs
- **Vercel:** Dashboard → Deployments → View Logs
- **Railway:** Dashboard → Deployments → View Logs

### Performance
- Use Vercel Analytics
- Monitor Railway metrics
- Set up error tracking (Sentry)

### Updates
```bash
# Update frontend
cd frontend
git pull
vercel --prod

# Update backend
cd backend
git push
# Railway auto-deploys on push
```

---

## Cost Estimation

### Free Tier Limits

**Vercel (Frontend):**
- ✅ 100GB bandwidth/month
- ✅ Unlimited deployments
- ✅ Custom domains
- ✅ SSL certificates

**Railway (Backend):**
- ✅ $5 free credit/month
- ✅ ~500 hours runtime
- ✅ 1GB RAM
- ✅ PostgreSQL database

**Total:** FREE for development/testing!

---

## Production Recommendations

1. **Use PostgreSQL** instead of SQLite
2. **Enable HTTPS** (automatic on Vercel/Railway)
3. **Set up monitoring** (Sentry, LogRocket)
4. **Configure CDN** for media files (Cloudinary, AWS S3)
5. **Enable caching** (Redis)
6. **Set up CI/CD** (GitHub Actions)
7. **Regular backups** of database
8. **Security headers** (django-security)

---

## Quick Deploy Commands

```bash
# Frontend (Vercel)
cd frontend
vercel --prod

# Backend (Railway)
cd backend
railway up

# Or use Git push (auto-deploy)
git add .
git commit -m "Deploy updates"
git push origin main
```

---

## Support & Resources

- **Vercel Docs:** https://vercel.com/docs
- **Railway Docs:** https://docs.railway.app/
- **Django Deployment:** https://docs.djangoproject.com/en/4.2/howto/deployment/
- **Vite Deployment:** https://vitejs.dev/guide/static-deploy.html

---

## Success! 🎉

Your AI-Powered Job Portal is now live!

- Frontend: https://your-app.vercel.app
- Backend: https://your-app.railway.app
- Admin: https://your-app.railway.app/admin

Share your deployed application and start recruiting with AI! 🚀
