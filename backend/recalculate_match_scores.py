import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.jobs.models import JobApplication
from ai_engine.semantic_matcher import SemanticMatcher

matcher = SemanticMatcher()

applications = JobApplication.objects.filter(match_score=0.0)
print(f"Found {applications.count()} applications with 0% match score")

updated = 0
for app in applications:
    try:
        match_result = matcher.match_resume_to_job(
            app.resume.parsed_data,
            {
                'title': app.job.title,
                'description': app.job.description,
                'requirements': app.job.requirements,
                'required_skills': app.job.required_skills
            }
        )
        
        app.match_score = match_result['match_percentage']
        app.save()
        updated += 1
        print(f"Updated application {app.id}: {app.candidate.username} -> {app.job.title} = {app.match_score}%")
    except Exception as e:
        print(f"Error updating application {app.id}: {e}")

print(f"\nSuccessfully updated {updated} applications")
