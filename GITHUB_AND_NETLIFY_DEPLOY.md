# Deploy AI-Powered Job Portal to GitHub & Netlify

## Complete Step-by-Step Guide

---

## ⚠️ Important Note About Django on Netlify

Netlify is primarily designed for static sites and serverless functions. Django (Python backend) is **NOT natively supported** on Netlify.

### Recommended Approach:
- **Frontend (React):** Deploy on Netlify ✅
- **Backend (Django):** Deploy on Railway/Render ✅

However, I'll show you both options below.

---

## Part 1: Push to GitHub

### Step 1: Initialize Git Repository

```bash
# Navigate to project root
cd "AI Powered Job Portal"

# Initialize git (if not already done)
git init

# Check status
git status
```

### Step 2: Create GitHub Repository

1. Go to https://github.com/
2. Click "+" → "New repository"
3. Repository name: `ai-powered-job-portal`
4. Description: "AI-Powered Job Portal with intelligent matching and career guidance"
5. Choose: Public or Private
6. **DO NOT** initialize with README (we already have one)
7. Click "Create repository"

### Step 3: Add and Commit Files

```bash
# Add all files
git add .

# Commit
git commit -m "Initial commit: AI-Powered Job Portal with React frontend and Django backend"

# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/ai-powered-job-portal.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 4: Verify Upload

1. Refresh your GitHub repository page
2. You should see all your files uploaded
3. Check that `.gitignore` is working (no `node_modules/`, `venv/`, etc.)

---

## Part 2: Deploy on Netlify

### Option A: Frontend Only on Netlify (RECOMMENDED)

This is the best approach for your project.

#### Step 1: Deploy Frontend on Netlify

1. Go to https://app.netlify.com/
2. Sign up/Login with GitHub
3. Click "Add new site" → "Import an existing project"
4. Choose "Deploy with GitHub"
5. Authorize Netlify
6. Select your repository: `ai-powered-job-portal`

#### Step 2: Configure Build Settings

```
Base directory: frontend
Build command: npm run build
Publish directory: frontend/dist
```

#### Step 3: Add Environment Variables

Click "Show advanced" → "New variable":
```
Key: VITE_API_URL
Value: https://your-backend.railway.app/api
```

(You'll update this after deploying backend)

#### Step 4: Deploy Backend on Railway

1. Go to https://railway.app/
2. Login with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Click "Add variables":
   ```
   SECRET_KEY=your-secret-key-here
   DEBUG=False
   ```
6. In Settings, set:
   - Root Directory: `/backend`
   - Start Command: `gunicorn config.wsgi:application`
7. Deploy!

#### Step 5: Update Frontend Environment Variable

1. Copy your Railway backend URL: `https://your-app.railway.app`
2. Go back to Netlify
3. Site settings → Environment variables
4. Update `VITE_API_URL` to: `https://your-app.railway.app/api`
5. Trigger redeploy: Deploys → Trigger deploy → Deploy site

---

### Option B: Try Both on Netlify (Experimental)

⚠️ **Warning:** This is complex and not recommended for Django apps.

#### Requirements:

1. **Add `runtime.txt` in backend folder:**
```txt
python-3.11
```

2. **Add `Procfile` in backend folder:**
```
web: gunicorn config.wsgi:application
```

3. **Update `netlify.toml` (already created in root):**
The file is already configured!

4. **Create Netlify Function Wrapper:**

Create `netlify/functions/api.js`:
```javascript
const { spawn } = require('child_process');

exports.handler = async (event, context) => {
  // This is a workaround - not ideal for Django
  return {
    statusCode: 501,
    body: JSON.stringify({ 
      error: 'Django backend not supported on Netlify',
      message: 'Please deploy backend on Railway or Render'
    })
  };
};
```

#### Deploy:

1. Push changes to GitHub
2. Netlify will auto-deploy
3. **Result:** Frontend works, but backend won't work properly

---

## Part 3: Recommended Deployment Architecture

### ✅ Best Practice Setup:

```
┌─────────────────────────────────────┐
│         GitHub Repository           │
│  (ai-powered-job-portal)           │
└──────────┬──────────────┬───────────┘
           │              │
           │              │
    ┌──────▼──────┐  ┌───▼──────────┐
    │   Netlify   │  │   Railway    │
    │  (Frontend) │  │  (Backend)   │
    │   React     │  │   Django     │
    └─────────────┘  └──────────────┘
           │              │
           └──────┬───────┘
                  │
            API Requests
```

### Why This Setup?

- ✅ **Netlify:** Perfect for React (fast, free, CDN)
- ✅ **Railway:** Perfect for Django (Python support, database)
- ✅ **Separate concerns:** Frontend and backend scale independently
- ✅ **Free tier:** Both services have generous free tiers

---

## Part 4: Complete Deployment Commands

### Push to GitHub:

```bash
# First time
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/ai-powered-job-portal.git
git push -u origin main

# Future updates
git add .
git commit -m "Update features"
git push
```

### Deploy Frontend (Netlify):

```bash
# Using Netlify CLI
npm install -g netlify-cli
cd frontend
netlify login
netlify init
netlify deploy --prod

# Or use GitHub integration (auto-deploy on push)
```

### Deploy Backend (Railway):

```bash
# Using Railway CLI
npm install -g @railway/cli
railway login
railway init
railway up

# Or use GitHub integration (auto-deploy on push)
```

---

## Part 5: Environment Variables

### Backend (Railway):

```env
SECRET_KEY=your-secret-key-here
DEBUG=False
ALLOWED_HOSTS=your-app.railway.app
DATABASE_URL=postgresql://... (auto-provided)
```

### Frontend (Netlify):

```env
VITE_API_URL=https://your-app.railway.app/api
```

---

## Part 6: Update Backend CORS

After deployment, update `backend/config/settings.py`:

```python
CORS_ALLOWED_ORIGINS = [
    'https://your-app.netlify.app',  # Your actual Netlify URL
    'http://localhost:3000',
]

ALLOWED_HOSTS = [
    'your-app.railway.app',  # Your actual Railway URL
    'localhost',
]
```

Push changes:
```bash
git add .
git commit -m "Update CORS settings"
git push
```

Both services will auto-deploy!

---

## Part 7: Verify Deployment

### Test Checklist:

1. ✅ Frontend loads: `https://your-app.netlify.app`
2. ✅ Login page works
3. ✅ Can register new user
4. ✅ Can upload resume
5. ✅ Job matching works
6. ✅ All API calls successful
7. ✅ No CORS errors in console

---

## Part 8: Continuous Deployment

### Auto-Deploy on Git Push:

```bash
# Make changes to your code
# ...

# Commit and push
git add .
git commit -m "Add new feature"
git push

# Both Netlify and Railway auto-deploy!
# Wait 2-3 minutes for deployment
```

---

## Troubleshooting

### Issue: "Failed to fetch" errors

**Solution:**
```bash
# Check CORS in backend/config/settings.py
# Verify VITE_API_URL in Netlify
# Check browser console for exact error
```

### Issue: Backend not responding

**Solution:**
- Check Railway logs
- Verify environment variables
- Test backend directly: `https://your-app.railway.app/api/`

### Issue: Build fails on Netlify

**Solution:**
```bash
# Test build locally first
cd frontend
npm install
npm run build

# If successful, push to GitHub
git push
```

---

## Quick Reference

### Your URLs:

- **GitHub:** `https://github.com/YOUR_USERNAME/ai-powered-job-portal`
- **Frontend:** `https://your-app.netlify.app`
- **Backend:** `https://your-app.railway.app`
- **Admin:** `https://your-app.railway.app/admin`

### Useful Commands:

```bash
# Check deployment status
netlify status
railway status

# View logs
netlify logs
railway logs

# Open in browser
netlify open
railway open
```

---

## Cost Summary

### Free Tier:

- **GitHub:** Unlimited public repos ✅
- **Netlify:** 100GB bandwidth/month ✅
- **Railway:** $5 credit/month ✅

**Total: FREE for development!** 🎉

---

## Next Steps

1. ✅ Push to GitHub
2. ✅ Deploy frontend on Netlify
3. ✅ Deploy backend on Railway
4. ✅ Update environment variables
5. ✅ Test all features
6. ✅ Share your app!

---

## 🎉 Success!

Your AI-Powered Job Portal is now live!

- **Code:** https://github.com/YOUR_USERNAME/ai-powered-job-portal
- **App:** https://your-app.netlify.app
- **API:** https://your-app.railway.app

Start recruiting with AI! 🚀
