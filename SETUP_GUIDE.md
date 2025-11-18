# AI Job Portal - Complete Setup Guide

## Prerequisites
- Python 3.9+
- Node.js 18+
- MySQL 8.0+
- Git

## Backend Setup

### 1. Install Python Dependencies
```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate

pip install -r requirements.txt
```

### 2. Download AI Models
```bash
python setup.py
```

### 3. Configure MySQL Database
```sql
CREATE DATABASE job_portal CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'jobportal_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON job_portal.* TO 'jobportal_user'@'localhost';
FLUSH PRIVILEGES;
```

### 4. Configure Environment
```bash
cp .env.example .env
# Edit .env with your database credentials
```

### 5. Run Migrations
```bash
python manage.py migrate
python manage.py createsuperuser
```

### 6. Create Media Directory
```bash
mkdir -p media/resumes
```

### 7. Start Backend Server
```bash
python manage.py runserver
```

Backend will run at: http://localhost:8000

## Frontend Setup

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

Frontend will run at: http://localhost:3000

## Testing the Application

### 1. Register Users
- Go to http://localhost:3000/register
- Create accounts with different roles (candidate, recruiter)

### 2. Upload Resume (Candidate)
- Login as candidate
- Upload a PDF/DOCX resume
- Wait for processing

### 3. Create Job (Recruiter)
- Login as recruiter
- Create a job posting with required skills

### 4. Match Resume to Jobs
- As candidate, click "Match Jobs" on your resume
- View match scores and explainability

### 5. View Analytics (Recruiter/Admin)
- Navigate to Analytics page
- View comprehensive dashboard

## API Endpoints

### Authentication
- POST `/api/auth/register/` - Register user
- POST `/api/auth/login/` - Login

### Resumes
- POST `/api/resumes/` - Upload resume
- GET `/api/resumes/` - List resumes
- POST `/api/resumes/{id}/reparse/` - Reparse resume

### Jobs
- GET `/api/jobs/jobs/` - List jobs
- POST `/api/jobs/jobs/` - Create job
- POST `/api/jobs/jobs/{id}/apply/` - Apply to job

### Matching
- POST `/api/match/` - Match resume to jobs
- POST `/api/match/bias/` - Detect bias
- POST `/api/match/fraud/` - Detect fraud
- POST `/api/match/learning-path/` - Generate learning path

### Interviews
- POST `/api/interviews/schedule/` - Schedule interview
- POST `/api/interviews/{id}/generate_questions/` - Generate questions

### Analytics
- GET `/api/analytics/dashboard/` - Dashboard analytics
- GET `/api/analytics/job/{id}/` - Job-specific analytics

### Feedback
- POST `/api/feedback/correction/` - Submit corrections
- GET `/api/feedback/audit-logs/` - View audit logs

## Troubleshooting

### MySQL Connection Error
- Verify MySQL is running
- Check credentials in .env
- Ensure database exists

### spaCy Model Not Found
```bash
python -m spacy download en_core_web_sm
```

### CORS Errors
- Ensure backend is running on port 8000
- Check CORS_ALLOWED_ORIGINS in settings.py

### File Upload Issues
- Check media directory permissions
- Verify MEDIA_ROOT in settings.py

## Production Deployment

### Backend
1. Set DEBUG=False in settings.py
2. Configure proper SECRET_KEY
3. Use production database
4. Set up Gunicorn/uWSGI
5. Configure Nginx reverse proxy
6. Set up SSL certificates

### Frontend
```bash
npm run build
# Serve dist/ folder with Nginx
```

## Features Implemented

✅ JWT Authentication & RBAC
✅ Resume Upload & AI Parsing (PDF, DOCX, Images with OCR)
✅ Semantic Job Matching (SBERT)
✅ Explainability Heatmap
✅ Bias Detection
✅ Fraud Detection
✅ Skill-Gap Analysis & Learning Paths
✅ Interview Question Generation
✅ Interview Scheduling
✅ Video Interview Evaluation (Prototype)
✅ Analytics Dashboard
✅ Human-in-the-loop Corrections
✅ Audit Logs
✅ Candidate Dashboard
✅ Recruiter Dashboard
✅ Admin Dashboard

## Tech Stack Summary

**Backend:**
- Django 4.2 + Django REST Framework
- MySQL database
- spaCy for NLP
- Sentence-BERT for semantic matching
- PyMuPDF for PDF parsing
- python-docx for DOCX parsing
- Tesseract OCR for image processing

**Frontend:**
- React 18
- Vite
- TailwindCSS
- Recharts for analytics
- Axios for API calls

**AI/ML:**
- Sentence Transformers (all-MiniLM-L6-v2)
- spaCy (en_core_web_sm)
- Custom bias detection
- Custom fraud detection
