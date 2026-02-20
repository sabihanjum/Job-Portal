import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.jobs.models import Job
from apps.authentication.models import User

# Get or create a recruiter user
recruiter, created = User.objects.get_or_create(
    username='recruiter1',
    defaults={
        'email': 'recruiter@example.com',
        'role': 'recruiter',
        'first_name': 'John',
        'last_name': 'Recruiter'
    }
)
if created:
    recruiter.set_password('recruiter123')
    recruiter.save()

# Jobs matching Sabiha's resume
matching_jobs = [
    {
        'title': 'AI/ML Engineer',
        'company': 'Tech Innovations AI',
        'location': 'Remote',
        'job_type': 'full-time',
        'experience_level': 'junior',
        'salary_min': 80000,
        'salary_max': 120000,
        'description': 'Join our AI team to develop machine learning solutions. Work on NLP, computer vision, and transformers. Build REST APIs and integrate AI models into production systems.',
        'requirements': 'Bachelor\'s degree in Computer Science, AI, or related field. Experience with Python, Machine Learning, transformers, FastAPI/Django. Strong understanding of NLP and image processing. Familiar with Docker and cloud deployment.',
        'required_skills': ['Python', 'Machine Learning', 'FastAPI', 'Django', 'Transformers', 'NLP', 'REST APIs', 'Docker', 'PostgreSQL'],
        'is_active': True,
    },
    {
        'title': 'Full Stack Developer (Python/React)',
        'company': 'WebTech Solutions',
        'location': 'Hybrid - Bangalore',
        'job_type': 'full-time',
        'experience_level': 'junior',
        'salary_min': 70000,
        'salary_max': 110000,
        'description': 'Looking for a full-stack developer to build scalable web applications. Work with React.js frontend and Python backend (FastAPI/Django). Integrate OAuth, JWT authentication, and build RESTful APIs.',
        'requirements': 'Bachelor\'s degree in Computer Science or related field. 1-2 years of experience. Proficiency in React.js, Node.js, Python, FastAPI/Django. Experience with JWT, OAuth, MongoDB, PostgreSQL, and Docker.',
        'required_skills': ['Python', 'React', 'FastAPI', 'Django', 'Node.js', 'JWT', 'OAuth', 'MongoDB', 'PostgreSQL', 'Docker', 'REST APIs'],
        'is_active': True,
    },
    {
        'title': 'Backend Python Developer',
        'company': 'API Masters Inc',
        'location': 'Remote',
        'job_type': 'full-time',
        'experience_level': 'junior',
        'salary_min': 75000,
        'salary_max': 115000,
        'description': 'Build and maintain high-performance backend systems using Python. Design RESTful APIs with FastAPI/Django. Implement secure authentication, work with databases, and deploy using Docker.',
        'requirements': 'Bachelor\'s degree in Computer Science. Strong Python skills. Experience with FastAPI, Django, Flask. Knowledge of JWT authentication, database design (MySQL, PostgreSQL, MongoDB), and containerization with Docker.',
        'required_skills': ['Python', 'FastAPI', 'Django', 'Flask', 'REST APIs', 'JWT', 'MySQL', 'PostgreSQL', 'MongoDB', 'Docker'],
        'is_active': True,
    },
    {
        'title': 'Machine Learning Engineer - NLP',
        'company': 'AI Research Labs',
        'location': 'Remote',
        'job_type': 'full-time',
        'experience_level': 'junior',
        'salary_min': 85000,
        'salary_max': 125000,
        'description': 'Work on cutting-edge NLP projects using transformers and large language models. Build ML pipelines, implement feature engineering, and deploy models via REST APIs. Experience with FastAPI and model serving required.',
        'requirements': 'Bachelor\'s degree in AI, Machine Learning, or Computer Science. Strong Python skills. Experience with transformers, NLP, scikit-learn. Familiarity with FastAPI/Django for model deployment. Knowledge of data structures and algorithms.',
        'required_skills': ['Python', 'Machine Learning', 'NLP', 'Transformers', 'FastAPI', 'scikit-learn', 'REST APIs', 'Data Structures', 'Algorithms'],
        'is_active': True,
    },
    {
        'title': 'Software Engineer - Full Stack',
        'company': 'Cloud Innovations',
        'location': 'Bangalore, India',
        'job_type': 'full-time',
        'experience_level': 'junior',
        'salary_min': 70000,
        'salary_max': 105000,
        'description': 'Join our engineering team to build scalable cloud applications. Work with React.js, Node.js, Python, and deploy to cloud platforms. Implement authentication, build APIs, and work with various databases.',
        'requirements': 'Bachelor\'s degree in Computer Science. Experience with Python, JavaScript, React.js, Node.js. Knowledge of Express.js, Tailwind CSS, FastAPI/Django. Familiar with Docker, cloud platforms, and RESTful API design.',
        'required_skills': ['Python', 'JavaScript', 'React', 'Node.js', 'Express.js', 'FastAPI', 'Django', 'Docker', 'REST APIs', 'Cloud', 'MySQL', 'MongoDB'],
        'is_active': True,
    },
    {
        'title': 'AI Software Engineer',
        'company': 'Digital Health Solutions',
        'location': 'Remote',
        'job_type': 'full-time',
        'experience_level': 'junior',
        'salary_min': 80000,
        'salary_max': 120000,
        'description': 'Build AI-powered healthcare applications. Work on medical image analysis, dental X-ray processing, and health monitoring systems. Use FastAPI, Django, transformers, and deploy with Docker.',
        'requirements': 'Bachelor\'s degree in AI/ML or Computer Science. Experience with Python, Machine Learning, computer vision. Knowledge of FastAPI, Django, JWT authentication, OAuth. Experience with image processing and medical AI is a plus.',
        'required_skills': ['Python', 'Machine Learning', 'Computer Vision', 'FastAPI', 'Django', 'Transformers', 'JWT', 'OAuth', 'Docker', 'REST APIs'],
        'is_active': True,
    },
    {
        'title': 'Junior Python Developer',
        'company': 'FinTech Innovators',
        'location': 'Mumbai, India',
        'job_type': 'full-time',
        'experience_level': 'junior',
        'salary_min': 65000,
        'salary_max': 95000,
        'description': 'Develop financial applications and loan eligibility systems. Build REST APIs with Python, implement machine learning models, and work with databases. Create secure authentication systems and integrate with third-party services.',
        'requirements': 'Bachelor\'s degree in Computer Science. Strong Python programming. Experience with FastAPI/Django/Flask. Knowledge of Machine Learning, REST APIs, SQL databases. Understanding of authentication mechanisms and data security.',
        'required_skills': ['Python', 'Machine Learning', 'FastAPI', 'Django', 'Flask', 'REST APIs', 'MySQL', 'PostgreSQL', 'JWT', 'Data Structures'],
        'is_active': True,
    },
]

# Create jobs
created_count = 0
for job_data in matching_jobs:
    # Check if job already exists
    if not Job.objects.filter(title=job_data['title'], company=job_data['company']).exists():
        Job.objects.create(posted_by=recruiter, **job_data)
        print(f"Created job: {job_data['title']} at {job_data['company']}")
        created_count += 1
    else:
        print(f"Job already exists: {job_data['title']} at {job_data['company']}")

print(f"\nTotal new jobs created: {created_count}")
print(f"Total jobs in database: {Job.objects.count()}")
