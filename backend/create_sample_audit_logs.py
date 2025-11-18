import os
import django
from datetime import datetime, timedelta

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.feedback.models import AuditLog
from apps.authentication.models import User
from apps.jobs.models import Job
from apps.resumes.models import Resume

# Get users
admin = User.objects.filter(role='admin').first()
recruiter = User.objects.filter(role='recruiter').first()
candidate = User.objects.filter(role='candidate').first()

if not admin or not recruiter or not candidate:
    print("Please ensure you have users with different roles")
    exit()

# Sample audit logs
audit_logs = [
    {
        'user': admin,
        'action': 'user_role_updated',
        'model_name': 'User',
        'object_id': recruiter.id,
        'changes': {'old_role': 'candidate', 'new_role': 'recruiter'}
    },
    {
        'user': recruiter,
        'action': 'job_created',
        'model_name': 'Job',
        'object_id': 1,
        'changes': {'title': 'Senior Software Engineer', 'company': 'Tech Innovations Inc'}
    },
    {
        'user': candidate,
        'action': 'resume_uploaded',
        'model_name': 'Resume',
        'object_id': 1,
        'changes': {'filename': 'resume.pdf', 'size': '245KB'}
    },
    {
        'user': recruiter,
        'action': 'application_status_updated',
        'model_name': 'JobApplication',
        'object_id': 1,
        'changes': {'old_status': 'applied', 'new_status': 'interview'}
    },
    {
        'user': admin,
        'action': 'job_deleted',
        'model_name': 'Job',
        'object_id': 99,
        'changes': {'title': 'Outdated Position', 'reason': 'Position filled'}
    },
    {
        'user': recruiter,
        'action': 'interview_scheduled',
        'model_name': 'Interview',
        'object_id': 1,
        'changes': {'candidate': candidate.username, 'date': '2025-11-20', 'type': 'video'}
    },
    {
        'user': candidate,
        'action': 'profile_updated',
        'model_name': 'User',
        'object_id': candidate.id,
        'changes': {'field': 'phone', 'old_value': '', 'new_value': '+1234567890'}
    },
    {
        'user': admin,
        'action': 'system_settings_updated',
        'model_name': 'Settings',
        'object_id': 1,
        'changes': {'setting': 'max_applications_per_day', 'old_value': '10', 'new_value': '15'}
    },
    {
        'user': recruiter,
        'action': 'job_updated',
        'model_name': 'Job',
        'object_id': 2,
        'changes': {'field': 'salary_max', 'old_value': '150000', 'new_value': '180000'}
    },
    {
        'user': candidate,
        'action': 'application_submitted',
        'model_name': 'JobApplication',
        'object_id': 2,
        'changes': {'job': 'Backend Developer', 'match_score': '65.5%'}
    }
]

# Create audit logs with different timestamps
created_count = 0
for i, log_data in enumerate(audit_logs):
    # Create logs with timestamps spread over the last 7 days
    log = AuditLog.objects.create(**log_data)
    # Manually set timestamp to simulate activity over time
    log.timestamp = datetime.now() - timedelta(days=6-i//2, hours=i*2)
    log.save()
    created_count += 1
    print(f"Created audit log: {log.action} by {log.user.username}")

print(f"\nSuccessfully created {created_count} audit logs")
print(f"Total audit logs in database: {AuditLog.objects.count()}")
