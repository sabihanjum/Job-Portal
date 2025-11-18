from rest_framework import serializers
from .models import Match

class MatchSerializer(serializers.ModelSerializer):
    job_title = serializers.CharField(source='job.title', read_only=True)
    job_company = serializers.CharField(source='job.company', read_only=True)
    
    class Meta:
        model = Match
        fields = ['id', 'resume', 'job', 'job_title', 'job_company', 'match_percentage', 
                  'matched_skills', 'missing_skills', 'heatmap', 'recommendation', 'created_at']
        read_only_fields = ['id', 'created_at']
