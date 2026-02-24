# Quick Render Deployment Checklist

## Prerequisites
- [ ] GitHub account with code pushed
- [ ] Render account (https://render.com)
- [ ] Backend URL ready (e.g., https://job-portal-backend.onrender.com)
- [ ] Frontend URL ready (e.g., https://job-portal-frontend.onrender.com)

## Pre-Deployment Setup
- [ ] Update [backend/config/settings.py](backend/config/settings.py) ✓ (Done)
- [ ] Create [Procfile](Procfile) ✓ (Done)
- [ ] Create [build.sh](build.sh) ✓ (Done)
- [ ] Review [RENDER_DEPLOYMENT.md](RENDER_DEPLOYMENT.md) ✓ (Done)
- [ ] Verify backend/requirements.txt has required packages
- [ ] Generate SECRET_KEY: `python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"`

## Deployment Steps

### 1. Create PostgreSQL Database
- [ ] Go to Render Dashboard
- [ ] New → PostgreSQL
- [ ] Copy connection string

### 2. Deploy Backend
- [ ] New → Web Service
- [ ] Connect GitHub repo
- [ ] Configure as per [RENDER_DEPLOYMENT.md](RENDER_DEPLOYMENT.md#step-3-deploy-backend-service)
- [ ] Add environment variables
- [ ] Copy backend URL

### 3. Deploy Frontend  
- [ ] New → Static Site
- [ ] Connect GitHub repo
- [ ] Build: `cd frontend && npm install && npm run build`
- [ ] Publish: `frontend/dist`
- [ ] Copy frontend URL

### 4. Post-Deployment
- [ ] Initialize database:
  - SSH into backend service
  - Run: `python backend/manage.py migrate`
  - Run: `python backend/manage.py createsuperuser`
- [ ] Update backend CORS: Add frontend URL
- [ ] Test API endpoints
- [ ] Test frontend connectivity

### 5. Optional: Custom Domain
- [ ] Add domain in Frontend Settings
- [ ] Update DNS records
- [ ] Update backend CORS for custom domain

## Environment Variables Template

**Backend Service:**
```
DEBUG=False
SECRET_KEY=[YOUR_SECRET_KEY]
DATABASE_URL=[POSTGRESQL_URL]
ALLOWED_HOSTS=[yourdomain.onrender.com]
CORS_ALLOWED_ORIGINS=https://[frontend-domain]
PYTHON_VERSION=3.11.8
```

**Frontend Service:**
- No special env vars needed (uses Vite build)

## Important Production Settings
- [ ] `DEBUG=False` (never True in production)
- [ ] Strong `SECRET_KEY` 
- [ ] Correct `DATABASE_URL`
- [ ] CORS properly configured
- [ ] All migrations applied

## Testing Checklist
- [ ] Backend health check: `GET /api/auth/register/` → Should respond
- [ ] Frontend loads without CORS errors
- [ ] User registration works
- [ ] Login functionality works
- [ ] Resume upload works
- [ ] Dashboard loads properly
- [ ] Database operations successful

## Logs Location
- Backend: Render Dashboard → job-portal-backend → Logs
- Frontend: Render Dashboard → job-portal-frontend → Build Logs

## Rollback Procedure
1. Go to deployment in Render Dashboard
2. Click previous successful deployment
3. Click "Redeploy"

## Performance & Scaling
- Monitor backend usage (Logs tab)
- Scale up if needed (Instance Type → Higher tier)
- Database connections may limit at certain scale
- Consider cleanup of old records periodically

## Security Checklist
- [ ] DEBUG=False
- [ ] Unique SECRET_KEY
- [ ] Strong database password
- [ ] HTTPS enabled (automatic)
- [ ] CORS properly restricted
- [ ] Admin credentials changed after deployment
- [ ] Secret management configured

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| 502 Bad Gateway | Check backend logs, verify DB connection |
| CORS Error | Update CORS_ALLOWED_ORIGINS with frontend URL |
| Static not loading | WhiteNoise handles this automatically |
| Slow build | Optimize requirements.txt, consider separate build |
| DB connection error | Verify DATABASE_URL format and connectivity |

## Next Improvements
- [ ] Set up AWS S3 for media uploads
- [ ] Configure email for notifications
- [ ] Add monitoring/alerts
- [ ] Set up backup strategy
- [ ] Optimize AI model loading
- [ ] Configure caching layer
- [ ] Set up CI/CD pipeline

---
**Helpful Commands:**
```bash
# Generate SECRET_KEY locally
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"

# Build frontend locally to test
cd frontend && npm run build

# Test backend migrations locally
cd backend && python manage.py migrate --plan
```
