# AI Job Portal - API Documentation

## Base URL
```
http://localhost:8000/api
```

## Authentication
All endpoints except `/auth/register/` and `/auth/login/` require JWT authentication.

Include token in header:
```
Authorization: Bearer <access_token>
```

---

## Authentication Endpoints

### Register User
**POST** `/auth/register/`

**Request Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "password2": "SecurePass123",
  "role": "candidate",
  "first_name": "John",
  "last_name": "Doe"
}
```

**Response:**
```json
{
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "role": "candidate"
  },
  "tokens": {
    "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
  }
}
```

### Login
**POST** `/auth/login/`

**Request Body:**
```json
{
  "username": "john_doe",
  "password": "SecurePass123"
}
```

---

## Resume Endpoints

### Upload Resume
**POST** `/resumes/`

**Request:** multipart/form-data
- `file`: Resume file (PDF, DOCX, or image)
- `file_type`: File extension

**Response:**
```json
{
  "id": 1,
  "file": "/media/resumes/resume_xyz.pdf",
  "file_type": "pdf",
  "parsed_data": {
    "name": "John Doe",
    "email": "john@example.com",
    "skills": ["python", "django", "react"],
    "experience": [...],
    "education": [...]
  },
  "is_processed": true
}
```

### List Resumes
**GET** `/resumes/`

### Reparse Resume
**POST** `/resumes/{id}/reparse/`

---

## Job Endpoints

### List Jobs
**GET** `/jobs/jobs/`

**Query Parameters:**
- `skills`: Comma-separated skills to filter

### Create Job
**POST** `/jobs/jobs/`

**Request Body:**
```json
{
  "title": "Senior Python Developer",
  "description": "We are looking for...",
  "requirements": "5+ years experience...",
  "company": "Tech Corp",
  "location": "Remote",
  "salary_range": "$100k-$150k",
  "required_skills": ["python", "django", "postgresql"],
  "experience_years": 5
}
```

### Apply to Job
**POST** `/jobs/jobs/{id}/apply/`

**Request Body:**
```json
{
  "resume_id": 1
}
```

---

## Matching Endpoints

### Match Resume to Jobs
**POST** `/match/`

**Request Body:**
```json
{
  "resume_id": 1,
  "job_ids": [1, 2, 3]
}
```

**Response:**
```json
{
  "matches": [
    {
      "id": 1,
      "job_title": "Senior Python Developer",
      "match_percentage": 85.5,
      "matched_skills": ["python", "django"],
      "missing_skills": ["kubernetes"],
      "heatmap": [
        {
          "job_requirement": "5+ years Python experience",
          "resume_fragment": "7 years of Python development...",
          "match_score": 0.92
        }
      ],
      "recommendation": "Excellent match! Highly recommended for interview."
    }
  ]
}
```

### Detect Bias
**POST** `/match/bias/`

**Request Body:**
```json
{
  "text": "Looking for young, energetic rockstar developer..."
}
```

**Response:**
```json
{
  "has_bias": true,
  "bias_count": 2,
  "issues": [
    {
      "type": "age_bias",
      "word": "young",
      "suggestion": "'young' may exclude older candidates"
    }
  ]
}
```

### Detect Fraud
**POST** `/match/fraud/`

**Request Body:**
```json
{
  "resume_id": 1
}
```

**Response:**
```json
{
  "is_suspicious": false,
  "risk_level": "none",
  "flags": []
}
```

### Generate Learning Path
**POST** `/match/learning-path/`

**Request Body:**
```json
{
  "missing_skills": ["kubernetes", "docker", "aws"]
}
```

**Response:**
```json
{
  "learning_path": [
    {
      "skill": "kubernetes",
      "platform": "Udemy",
      "course": "Kubernetes for Beginners",
      "duration": "8 hours"
    }
  ]
}
```

---

## Interview Endpoints

### Schedule Interview
**POST** `/interviews/schedule/`

**Request Body:**
```json
{
  "application_id": 1,
  "scheduled_date": "2024-12-01T10:00:00Z",
  "duration_minutes": 60,
  "meeting_link": "https://zoom.us/j/123456",
  "notes": "Technical interview"
}
```

### Generate Questions
**POST** `/interviews/{id}/generate_questions/`

**Response:**
```json
{
  "questions": [
    {
      "type": "technical",
      "skill": "python",
      "question": "Explain decorators in Python..."
    },
    {
      "type": "behavioral",
      "question": "Tell me about a challenging project..."
    }
  ]
}
```

---

## Analytics Endpoints

### Dashboard Analytics
**GET** `/analytics/dashboard/`

**Response:**
```json
{
  "avg_match_score": 72.5,
  "applications_per_job": [...],
  "most_common_skills": [...],
  "pipeline_stats": {
    "total_applications": 150,
    "screening": 45,
    "interview": 20,
    "accepted": 10,
    "rejected": 75
  },
  "match_distribution": {...},
  "interview_stats": {...}
}
```

### Job Analytics
**GET** `/analytics/job/{id}/`

---

## Feedback Endpoints

### Submit Correction
**POST** `/feedback/correction/`

**Request Body:**
```json
{
  "resume_id": 1,
  "corrections": [
    {
      "field": "name",
      "value": "John Smith"
    },
    {
      "field": "email",
      "value": "john.smith@example.com"
    }
  ]
}
```

### Audit Logs
**GET** `/feedback/audit-logs/`

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "resume_id is required"
}
```

### 401 Unauthorized
```json
{
  "detail": "Authentication credentials were not provided."
}
```

### 404 Not Found
```json
{
  "error": "Resume not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```
