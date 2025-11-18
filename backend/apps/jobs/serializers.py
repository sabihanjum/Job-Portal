from rest_framework import serializers
from .models import Job, JobApplication

class JobSerializer(serializers.ModelSerializer):
    posted_by_name = serializers.CharField(source='posted_by.username', read_only=True)
    
    class Meta:
        model = Job
        fields = ['id', 'title', 'description', 'requirements', 'company', 'location', 
                  'job_type', 'experience_level', 'salary_min', 'salary_max',
                  'required_skills', 'experience_years', 'posted_by', 
                  'posted_by_name', 'is_active', 'created_at', 'updated_at']
        read_only_fields = ['id', 'posted_by', 'created_at', 'updated_at']

class JobApplicationSerializer(serializers.ModelSerializer):
    job_title = serializers.CharField(source='job.title', read_only=True)
    candidate_name = serializers.CharField(source='candidate.username', read_only=True)
    
    class Meta:
        model = JobApplication
        fields = ['id', 'job', 'job_title', 'candidate', 'candidate_name', 'resume', 
                  'status', 'match_score', 'created_at', 'updated_at']
        read_only_fields = ['id', 'candidate', 'match_score', 'created_at', 'updated_at']
