# Interactive Render Deployment Checklist

Follow this checklist in order. Mark each step as you complete it.

---

## ✅ Phase 1: Local Preparation (5 minutes)

### [ ] Step 1.1: Generate Secret Key
```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```
**Save output here:** `_________________________________`

### [ ] Step 1.2: Test Local Build
```bash
.venv\Scripts\activate
cd backend && python manage.py check && cd ..
cd frontend && npm install && npm run build && cd ..
```
**Status:** ✅ No errors | ❌ Has errors

### [ ] Step 1.3: Commit & Push to GitHub
```bash
git add .
git commit -m "Ready for Render deployment"
git push origin main
```
**Pushed to branch:** `main`

---

## ✅ Phase 2: Database Setup (3 minutes)

### [ ] Step 2.1: Create PostgreSQL Database
- Go to: https://dashboard.render.com
- Click: **New +** → **PostgreSQL**
- Name: `job-portal-db`
- Region: **Oregon (US-West)**
- Plan: **Starter (Free)**
- Click: **Create Database**

### [ ] Step 2.2: Copy Database URL
- Go to: Database → Info tab
- Copy: **Internal Database URL**
- Save here: `postgresql://___________________________________`

⏱️ **Wait time:** 2-3 minutes for database provisioning

---

## ✅ Phase 3: Backend Deployment (10 minutes)

### [ ] Step 3.1: Create Backend Web Service
- Click: **New +** → **Web Service**
- Connect: Your GitHub repository
- Name: `job-portal-backend`
- Region: **Oregon (US-West)** ⚠️ Same as database
- Branch: `main`
- Build Command: `bash build.sh`
- Start Command: `cd backend && gunicorn config.wsgi:application --bind 0.0.0.0:$PORT`

### [ ] Step 3.2: Add Environment Variables

Add these one by one:

| Variable | Value |
|----------|-------|
| `PYTHON_VERSION` | `3.11` |
| `DEBUG` | `False` |
| `SECRET_KEY` | [paste from Step 1.1] |
| `DATABASE_URL` | [paste from Step 2.2] |
| `ALLOWED_HOSTS` | `job-portal-backend.onrender.com` |
| `CORS_ALLOWED_ORIGINS` | `https://job-portal-backend.onrender.com` |

### [ ] Step 3.3: Deploy Backend
- Click: **Create Web Service**
- ⏱️ **Wait:** 10-15 minutes for first deploy
- Watch: Build logs for errors

### [ ] Step 3.4: Copy Backend URL
**Backend URL:** `https://_______________________________.onrender.com`

### [ ] Step 3.5: Create Superuser
- Go to: Backend Service → **Shell** tab
- Run:
```bash
cd backend
python manage.py createsuperuser
```
- Username: `admin`
- Email: `your-email@example.com`
- Password: `_______________` (save this!)

---

## ✅ Phase 4: Frontend Deployment (7 minutes)

### [ ] Step 4.1: Update API URL in Code
Edit file: `frontend/src/services/api.js` (or similar)

Change API URL to your backend:
```javascript
const API_BASE_URL = 'https://job-portal-backend.onrender.com/api';
```

### [ ] Step 4.2: Commit & Push Changes
```bash
git add frontend/src/services/api.js
git commit -m "Update API URL for production"
git push origin main
```

### [ ] Step 4.3: Create Frontend Static Site
- Click: **New +** → **Static Site**
- Connect: Your GitHub repository
- Name: `job-portal-frontend`
- Branch: `main`
- Build Command: `cd frontend && npm install && npm run build`
- Publish Directory: `frontend/dist`

### [ ] Step 4.4: Deploy Frontend
- Click: **Create Static Site**
- ⏱️ **Wait:** 5-7 minutes for build

### [ ] Step 4.5: Copy Frontend URL
**Frontend URL:** `https://_______________________________.onrender.com`

---

## ✅ Phase 5: Connect Services (5 minutes)

### [ ] Step 5.1: Update Backend CORS
- Go to: Backend Service → **Environment** tab
- Edit: `CORS_ALLOWED_ORIGINS`
- Change to: `https://[your-frontend-url].onrender.com,https://[your-backend-url].onrender.com`
- Edit: `ALLOWED_HOSTS`
- Change to: `[your-backend-domain].onrender.com,[your-frontend-domain].onrender.com`
- Click: **Save Changes**
- ⏱️ **Wait:** 2-3 minutes for redeploy

---

## ✅ Phase 6: Testing (5 minutes)

### [ ] Step 6.1: Test Backend Health
Open in browser:
- [ ] `https://[your-backend-url].onrender.com/api/`
- [ ] `https://[your-backend-url].onrender.com/admin/`

**Expected:** Both pages load without errors

### [ ] Step 6.2: Test Admin Login
- Open: `https://[your-backend-url].onrender.com/admin/`
- Login with credentials from Step 3.5
- **Status:** ✅ Logged in | ❌ Failed

### [ ] Step 6.3: Test Frontend
Open: `https://[your-frontend-url].onrender.com`

Check:
- [ ] Home page loads
- [ ] No CORS errors (Press F12 → Console)
- [ ] Registration form works
- [ ] Login form works

### [ ] Step 6.4: Test End-to-End
- [ ] Register a new account
- [ ] Login with new account
- [ ] Navigate to dashboard
- [ ] View job listings

---

## ✅ Phase 7: Final Verification

### [ ] Step 7.1: Check Logs
- Backend Logs: Backend Service → **Logs** tab
- Frontend Logs: Frontend Static Site → **Logs** tab
- Database Logs: PostgreSQL → **Logs** tab

**Any errors?** ✅ No | ❌ Yes (check troubleshooting below)

### [ ] Step 7.2: Performance Check
- [ ] Backend responds in < 3 seconds
- [ ] Frontend loads in < 2 seconds
- [ ] API calls complete successfully

### [ ] Step 7.3: Security Check
- [ ] `DEBUG=False` ✅
- [ ] Strong `SECRET_KEY` ✅
- [ ] CORS properly configured ✅
- [ ] SSL/HTTPS working ✅

---

## 🎉 Deployment Complete!

### Your Live URLs:
- **Frontend:** `https://___________________________________`
- **Backend API:** `https://_______________________________/api/`
- **Admin Panel:** `https://_______________________________/admin/`

### Credentials:
- **Admin Username:** `admin`
- **Admin Password:** `_______________`

---

## 🔧 Common Issues & Solutions

### Issue: Backend won't deploy
**Solutions:**
1. Check build logs for errors
2. Verify `build.sh` has correct permissions
3. Ensure `requirements.txt` is valid
4. Check Python version is 3.11

### Issue: CORS errors in frontend
**Solutions:**
1. Verify `CORS_ALLOWED_ORIGINS` includes frontend URL
2. Ensure both URLs use HTTPS
3. Clear browser cache (Ctrl+Shift+R)
4. Check backend logs for CORS errors

### Issue: Database connection fails
**Solutions:**
1. Verify `DATABASE_URL` is correct
2. Ensure backend and database in same region
3. Check database status (should be "Available")
4. Wait 5 mins and retry (cold start issue)

### Issue: Frontend shows blank page
**Solutions:**
1. Check frontend build logs
2. Verify `Publish Directory` is `frontend/dist`
3. Check browser console for errors (F12)
4. Ensure API URL is correct in frontend code

### Issue: Static files not loading
**Solutions:**
1. Run in backend shell:
```bash
cd backend
python manage.py collectstatic --noinput
```
2. Check `STATIC_ROOT` in settings.py
3. Verify `whitenoise` is in `INSTALLED_APPS`

---

## 📞 Need Help?

### Check These First:
1. ❓ Build Logs: Service → Logs tab
2. ❓ Environment Variables: Service → Environment tab  
3. ❓ Database Status: Database → Info tab
4. ❓ Service Status: Dashboard overview

### Resources:
- 📖 [Full Deployment Guide](DEPLOY_TO_RENDER.md)
- 📖 [Command Reference](RENDER_COMMANDS.md)
- 🌐 [Render Docs](https://render.com/docs)
- 💬 [Render Community](https://community.render.com)

---

## 📋 Post-Deployment Tasks

### Optional but Recommended:

#### [ ] Enable Auto-Deploy
- Service → Settings → Auto-Deploy → **Enable**
- Automatically deploys on git push

#### [ ] Set Up Custom Domain
- Static Site → Settings → Custom Domain
- Follow DNS configuration steps

#### [ ] Enable Monitoring
- Set up health checks
- Configure alert emails

#### [ ] Create Sample Data
Via backend shell:
```bash
cd backend
python create_sample_jobs.py
```

#### [ ] Set Up Backups
- Database → Backups tab
- Enable automatic backups

---

**Completed:** `______` / 25 steps

**Total Time:** ~35 minutes

**Status:** 🟢 All systems operational | 🟡 Minor issues | 🔴 Major issues

---

*Last updated: February 24, 2026*
