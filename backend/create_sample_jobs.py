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
    print(f"Created recruiter user: {recruiter.username}")

# Sample jobs data
sample_jobs = [
    {
        'title': 'Senior Software Engineer',
        'company': 'Tech Innovations Inc',
        'location': 'San Francisco, CA',
        'job_type': 'full-time',
        'experience_level': 'senior',
        'salary_min': 120000,
        'salary_max': 180000,
        'description': 'We are looking for an experienced software engineer to join our team. You will work on cutting-edge technologies and help build scalable applications.',
        'requirements': 'Bachelor\'s degree in Computer Science or related field. 5+ years of experience in software development. Strong knowledge of Python, JavaScript, and cloud technologies.',
        'required_skills': ['Python', 'JavaScript', 'AWS', 'Docker', 'React'],
        'is_active': True,
    },
    {
        'title': 'Data Scientist',
        'company': 'AI Solutions Corp',
        'location': 'New York, NY',
        'job_type': 'full-time',
        'experience_level': 'mid',
        'salary_min': 90000,
        'salary_max': 130000,
        'description': 'Join our data science team to work on machine learning projects and data analysis. You will help drive business decisions through data insights.',
        'requirements': 'Master\'s degree in Data Science, Statistics, or related field. 3+ years of experience in data analysis and machine learning. Proficiency in Python and SQL.',
        'required_skills': ['Python', 'Machine Learning', 'SQL', 'TensorFlow', 'Pandas'],
        'is_active': True,
    },
    {
        'title': 'Frontend Developer',
        'company': 'WebDev Studios',
        'location': 'Austin, TX',
        'job_type': 'full-time',
        'experience_level': 'mid',
        'salary_min': 80000,
        'salary_max': 110000,
        'description': 'We need a talented frontend developer to create beautiful and responsive user interfaces. You will work closely with designers and backend developers.',
        'requirements': 'Bachelor\'s degree or equivalent experience. 2+ years of frontend development experience. Strong skills in React, HTML, CSS, and JavaScript.',
        'required_skills': ['React', 'JavaScript', 'HTML', 'CSS', 'TypeScript'],
        'is_active': True,
    },
    {
        'title': 'DevOps Engineer',
        'company': 'Cloud Systems Ltd',
        'location': 'Seattle, WA',
        'job_type': 'full-time',
        'experience_level': 'senior',
        'salary_min': 110000,
        'salary_max': 150000,
        'description': 'Looking for a DevOps engineer to manage our cloud infrastructure and CI/CD pipelines. You will ensure high availability and scalability of our systems.',
        'requirements': '4+ years of DevOps experience. Strong knowledge of AWS, Kubernetes, and Docker. Experience with infrastructure as code.',
        'required_skills': ['AWS', 'Kubernetes', 'Docker', 'Terraform', 'Jenkins'],
        'is_active': True,
    },
    {
        'title': 'Product Manager',
        'company': 'Startup Ventures',
        'location': 'Boston, MA',
        'job_type': 'full-time',
        'experience_level': 'mid',
        'salary_min': 95000,
        'salary_max': 125000,
        'description': 'We are seeking a product manager to lead product development and strategy. You will work with cross-functional teams to deliver innovative products.',
        'requirements': 'Bachelor\'s degree in Business, Computer Science, or related field. 3+ years of product management experience. Strong analytical and communication skills.',
        'required_skills': ['Product Strategy', 'Agile', 'User Research', 'Analytics', 'Communication'],
        'is_active': True,
    },
    {
        'title': 'UX/UI Designer',
        'company': 'Design Hub',
        'location': 'Los Angeles, CA',
        'job_type': 'full-time',
        'experience_level': 'mid',
        'salary_min': 75000,
        'salary_max': 105000,
        'description': 'Join our design team to create intuitive and beautiful user experiences. You will work on web and mobile applications.',
        'requirements': 'Bachelor\'s degree in Design or related field. 2+ years of UX/UI design experience. Proficiency in Figma, Sketch, or Adobe XD.',
        'required_skills': ['Figma', 'UI Design', 'UX Research', 'Prototyping', 'User Testing'],
        'is_active': True,
    },
    {
        'title': 'Backend Developer',
        'company': 'API Masters',
        'location': 'Remote',
        'job_type': 'full-time',
        'experience_level': 'mid',
        'salary_min': 85000,
        'salary_max': 115000,
        'description': 'We need a backend developer to build and maintain our API services. You will work with microservices architecture and databases.',
        'requirements': 'Bachelor\'s degree in Computer Science. 3+ years of backend development experience. Strong knowledge of Node.js or Python.',
        'required_skills': ['Python', 'Django', 'PostgreSQL', 'REST API', 'Redis'],
        'is_active': True,
    },
    {
        'title': 'Mobile App Developer',
        'company': 'Mobile First Inc',
        'location': 'Chicago, IL',
        'job_type': 'full-time',
        'experience_level': 'mid',
        'salary_min': 80000,
        'salary_max': 110000,
        'description': 'Looking for a mobile developer to build iOS and Android applications. You will work on both native and cross-platform development.',
        'requirements': '2+ years of mobile development experience. Knowledge of React Native or Flutter. Experience with iOS and Android development.',
        'required_skills': ['React Native', 'iOS', 'Android', 'JavaScript', 'Mobile UI'],
        'is_active': True,
    },
]

# Create jobs
created_count = 0
for job_data in sample_jobs:
    job, created = Job.objects.get_or_create(
        title=job_data['title'],
        company=job_data['company'],
        defaults={
            **job_data,
            'posted_by': recruiter
        }
    )
    if created:
        created_count += 1
        print(f"Created job: {job.title} at {job.company}")
    else:
        print(f"Job already exists: {job.title} at {job.company}")

print(f"\nTotal jobs created: {created_count}")
print(f"Total jobs in database: {Job.objects.count()}")
