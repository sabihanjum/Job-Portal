from rest_framework import serializers
from .models import Interview, InterviewEvaluation

class InterviewSerializer(serializers.ModelSerializer):
    candidate_name = serializers.CharField(source='application.candidate.username', read_only=True)
    job_title = serializers.CharField(source='application.job.title', read_only=True)
    
    class Meta:
        model = Interview
        fields = ['id', 'application', 'candidate_name', 'job_title', 'scheduled_by', 
                  'scheduled_date', 'duration_minutes', 'meeting_link', 'notes', 
                  'questions', 'status', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

class InterviewEvaluationSerializer(serializers.ModelSerializer):
    class Meta:
        model = InterviewEvaluation
        fields = ['id', 'interview', 'sentiment_score', 'clarity_score', 'keyword_matches', 
                  'overall_score', 'feedback', 'created_at']
        read_only_fields = ['id', 'created_at']
