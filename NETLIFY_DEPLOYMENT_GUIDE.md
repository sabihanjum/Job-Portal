# Deploy AI-Powered Job Portal on Netlify

## Complete Deployment Guide

---

## Architecture

- **Frontend (React):** Netlify
- **Backend (Django):** Railway or Render

---

## Part 1: Deploy Backend (Railway - Recommended)

### Step 1: Prepare Backend

1. **Add to `backend/requirements.txt`:**
```txt
gunicorn==21.2.0
whitenoise==6.6.0
dj-database-url==2.1.0
psycopg2-binary==2.9.9
```

2. **Update `backend/config/settings.py`:**
```python
import dj_database_url
import os

# CORS Configuration
CORS_ALLOWED_ORIGINS = [
    'https://your-app.netlify.app',  # Update after deployment
    'http://localhost:3000',
]

ALLOWED_HOSTS = ['*']  # Update with your domain

# Database
DATABASES = {
    'default': dj_database_url.config(
        default='sqlite:///db.sqlite3',
        conn_max_age=600
    )
}

# WhiteNoise for static files
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',  # Add this line
    # ... rest of middleware
]

STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'
```

### Step 2: Deploy Backend to Railway

1. Go to https://railway.app/
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Set root directory to `backend`
6. Add environment variables:
   ```
   SECRET_KEY=your-secret-key-here
   DEBUG=False
   ```
7. Deploy and note your URL: `https://your-app.railway.app`

---

## Part 2: Deploy Frontend on Netlify

### Method 1: Using Netlify CLI (Fastest)

#### Step 1: Install Netlify CLI

```bash
npm install -g netlify-cli
```

#### Step 2: Prepare Frontend

The `netlify.toml` file is already created in your frontend folder!

Create `.env.production` in frontend folder:
```env
VITE_API_URL=https://your-backend.railway.app/api
```

#### Step 3: Build and Deploy

```bash
# Navigate to frontend folder
cd frontend

# Login to Netlify
netlify login

# Initialize and deploy
netlify init

# Follow prompts:
# - Create & configure a new site
# - Team: Your team
# - Site name: ai-job-portal (or your choice)
# - Build command: npm run build
# - Publish directory: dist

# Deploy to production
netlify deploy --prod
```

#### Step 4: Set Environment Variables

```bash
# Set environment variable
netlify env:set VITE_API_URL https://your-backend.railway.app/api

# Redeploy
netlify deploy --prod
```

---

### Method 2: Using Netlify Dashboard (Easiest)

#### Step 1: Push to GitHub

```bash
git add .
git commit -m "Prepare for Netlify deployment"
git push origin main
```

#### Step 2: Deploy on Netlify

1. Go to https://app.netlify.com/
2. Click "Add new site" → "Import an existing project"
3. Choose "Deploy with GitHub"
4. Authorize Netlify to access your GitHub
5. Select your repository

#### Step 3: Configure Build Settings

```
Base directory: frontend
Build command: npm run build
Publish directory: frontend/dist
```

#### Step 4: Add Environment Variables

1. Go to Site settings → Environment variables
2. Add variable:
   - **Key:** `VITE_API_URL`
   - **Value:** `https://your-backend.railway.app/api`

#### Step 5: Deploy

1. Click "Deploy site"
2. Wait for build to complete (2-3 minutes)
3. Your site is live! 🎉

---

### Method 3: Drag & Drop (Quick Test)

#### Step 1: Build Locally

```bash
cd frontend
npm install
npm run build
```

#### Step 2: Deploy

1. Go to https://app.netlify.com/drop
2. Drag the `frontend/dist` folder
3. Site deployed instantly!

**Note:** This method doesn't support environment variables easily. Use for testing only.

---

## Post-Deployment Configuration

### 1. Update Backend CORS

Update `backend/config/settings.py`:
```python
CORS_ALLOWED_ORIGINS = [
    'https://your-actual-site.netlify.app',  # Your Netlify URL
    'http://localhost:3000',
]

ALLOWED_HOSTS = [
    'your-backend.railway.app',
    'localhost',
]
```

Redeploy backend on Railway.

### 2. Custom Domain (Optional)

#### On Netlify:
1. Go to Site settings → Domain management
2. Click "Add custom domain"
3. Enter your domain (e.g., `jobportal.com`)
4. Follow DNS configuration instructions
5. SSL certificate is automatic!

### 3. Test Your Deployment

Visit your Netlify URL and test:
- ✅ Login/Register
- ✅ Resume upload
- ✅ Job matching
- ✅ Application submission
- ✅ All API calls working

---

## Netlify Configuration Files

### `frontend/netlify.toml` (Already Created!)

```toml
[build]
  command = "npm run build"
  publish = "dist"
  
[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
```

### `frontend/.env.production`

```env
VITE_API_URL=https://your-backend.railway.app/api
```

---

## Continuous Deployment

### Auto-Deploy on Git Push

Netlify automatically deploys when you push to GitHub:

```bash
# Make changes
git add .
git commit -m "Update feature"
git push origin main

# Netlify auto-deploys in 2-3 minutes!
```

### Deploy Previews

- Every pull request gets a preview URL
- Test before merging to main
- Automatic cleanup after merge

---

## Environment Variables Summary

### Backend (Railway)
```
SECRET_KEY=your-secret-key
DEBUG=False
ALLOWED_HOSTS=your-backend.railway.app
```

### Frontend (Netlify)
```
VITE_API_URL=https://your-backend.railway.app/api
```

---

## Troubleshooting

### Issue 1: "Failed to fetch" errors

**Solution:**
- Check CORS settings in backend
- Verify VITE_API_URL is correct
- Check browser console for exact error

### Issue 2: 404 on page refresh

**Solution:**
- Ensure `netlify.toml` has redirects configured
- Check publish directory is `dist`

### Issue 3: Environment variables not working

**Solution:**
```bash
# Rebuild with env vars
netlify env:set VITE_API_URL https://your-backend.railway.app/api
netlify deploy --prod --force
```

### Issue 4: Build fails

**Solution:**
- Check build logs in Netlify dashboard
- Verify `package.json` has all dependencies
- Try building locally first: `npm run build`

### Issue 5: API calls fail

**Solution:**
- Test backend directly: `https://your-backend.railway.app/api/`
- Check backend logs on Railway
- Verify CORS configuration

---

## Netlify Features

### Free Tier Includes:
- ✅ 100GB bandwidth/month
- ✅ 300 build minutes/month
- ✅ Automatic HTTPS/SSL
- ✅ Continuous deployment
- ✅ Deploy previews
- ✅ Custom domains
- ✅ Form handling
- ✅ Serverless functions

### Useful Commands

```bash
# Check deployment status
netlify status

# View site in browser
netlify open

# View build logs
netlify watch

# Link existing site
netlify link

# Environment variables
netlify env:list
netlify env:set KEY value
netlify env:unset KEY
```

---

## Performance Optimization

### 1. Enable Netlify Analytics

```bash
netlify plugins:install netlify-plugin-analytics
```

### 2. Add Build Plugins

Create `netlify.toml`:
```toml
[[plugins]]
  package = "@netlify/plugin-lighthouse"
```

### 3. Optimize Images

- Use WebP format
- Lazy loading
- CDN for large files

---

## Monitoring

### View Logs

1. Netlify Dashboard → Site → Deploys
2. Click on deployment
3. View build logs and function logs

### Analytics

1. Site settings → Analytics
2. Enable Netlify Analytics ($9/month)
3. Or use Google Analytics (free)

---

## Cost Breakdown

### Free Tier (Perfect for this project!)

**Netlify:**
- ✅ FREE for personal projects
- ✅ 100GB bandwidth
- ✅ Unlimited sites

**Railway:**
- ✅ $5 free credit/month
- ✅ Enough for backend

**Total: FREE!** 🎉

---

## Quick Reference

### Deploy Commands

```bash
# First time
cd frontend
netlify login
netlify init
netlify deploy --prod

# Updates
git push origin main  # Auto-deploys!

# Manual deploy
netlify deploy --prod

# Rollback
netlify rollback
```

### URLs

- **Netlify Dashboard:** https://app.netlify.com/
- **Railway Dashboard:** https://railway.app/
- **Your Site:** https://your-app.netlify.app
- **Your API:** https://your-app.railway.app

---

## Success Checklist

- [ ] Backend deployed on Railway
- [ ] Frontend deployed on Netlify
- [ ] Environment variables configured
- [ ] CORS settings updated
- [ ] Custom domain added (optional)
- [ ] SSL certificate active (automatic)
- [ ] All features tested
- [ ] Continuous deployment working

---

## Next Steps

1. **Share your app:** `https://your-app.netlify.app`
2. **Monitor usage:** Check Netlify analytics
3. **Add features:** Push to GitHub, auto-deploys!
4. **Scale up:** Upgrade plans as needed

---

## Support

- **Netlify Docs:** https://docs.netlify.com/
- **Netlify Community:** https://answers.netlify.com/
- **Railway Docs:** https://docs.railway.app/

---

## 🎉 Congratulations!

Your AI-Powered Job Portal is now live on Netlify!

**Frontend:** https://your-app.netlify.app
**Backend:** https://your-app.railway.app

Start recruiting with AI! 🚀
