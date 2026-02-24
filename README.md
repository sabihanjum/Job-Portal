# AI-Powered Job Portal

Enterprise recruitment automation platform with AI-powered resume parsing, semantic matching, and analytics.

## Tech Stack
- **Frontend**: React + TailwindCSS
- **Backend**: Django + Django REST Framework
- **Database**: MySQL
- **AI/ML**: spaCy, transformers, sentence-transformers, Tesseract OCR
- **Storage**: Local file storage (Django MEDIA_ROOT)

## Features
- JWT Authentication & RBAC (Candidate, Recruiter, Admin)
- AI Resume Parsing (PDF, DOCX, Images with OCR)
- Semantic Job Matching (SBERT embeddings)
- Explainability (Match heatmap)
- Interview Question Generation & Scheduling
- Bias & Fraud Detection
- Skill-Gap Analysis & Learning Paths
- Analytics Dashboard
- Human-in-the-loop Corrections

## Setup

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
python -m spacy download en_core_web_sm
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### Frontend
```bash
cd frontend
npm install
npm start
```

### MySQL Setup
Create database:
```sql
CREATE DATABASE job_portal CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'jobportal_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON job_portal.* TO 'jobportal_user'@'localhost';
```

## Deployment

### 🚀 Deploy to Render (Recommended)

Choose your deployment guide:

1. **[📖 Complete Step-by-Step Guide](DEPLOY_TO_RENDER.md)** - Comprehensive guide with detailed explanations
2. **[⚡ Quick Command Reference](RENDER_COMMANDS.md)** - All commands in one place for easy copy-paste
3. **[✅ Interactive Checklist](DEPLOYMENT_CHECKLIST.md)** - Follow along and mark your progress

**Quick Start:**
```bash
# 1. Generate secret key
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"

# 2. Push to GitHub
git add .
git commit -m "Deploy to Render"
git push origin main

# 3. Follow the deployment guide to create services on Render
```

**Deployment Time:** ~35 minutes for first deployment

**What You'll Get:**
- Backend API: `https://your-backend.onrender.com`
- Frontend: `https://your-frontend.onrender.com`
- PostgreSQL Database (Free tier available)
- SSL/HTTPS enabled automatically
- Auto-deploy on git push

## API Endpoints

### Authentication
- POST `/api/auth/register/` - User registration
- POST `/api/auth/login/` - User login

### Resumes
- POST `/api/resumes/upload/` - Upload & parse resume
- GET `/api/resumes/` - List user resumes

### Jobs
- GET `/api/jobs/` - List jobs
- POST `/api/jobs/` - Create job (Recruiter)

### Matching
- POST `/api/match/` - Match resume to jobs

### Interviews
- POST `/api/interviews/schedule/` - Schedule interview
- POST `/api/interviews/questions/` - Generate questions

### Analytics
- GET `/api/analytics/dashboard/` - Dashboard data

### Feedback
- POST `/api/feedback/correction/` - Submit corrections
