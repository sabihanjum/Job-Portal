from django.db import models
from django.conf import settings

class Interview(models.Model):
    INTERVIEW_TYPE_CHOICES = [
        ('phone', 'Phone'),
        ('video', 'Video'),
        ('in-person', 'In-Person'),
    ]
    
    application = models.ForeignKey('jobs.JobApplication', on_delete=models.CASCADE, related_name='interviews')
    scheduled_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='scheduled_interviews')
    
    scheduled_date = models.DateTimeField()
    interview_type = models.CharField(max_length=20, choices=INTERVIEW_TYPE_CHOICES, default='video')
    duration_minutes = models.IntegerField(default=60)
    meeting_link = models.URLField(blank=True)
    notes = models.TextField(blank=True)
    
    questions = models.JSONField(default=list)
    
    STATUS_CHOICES = [
        ('scheduled', 'Scheduled'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='scheduled')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'interviews'
        ordering = ['scheduled_date']

class InterviewEvaluation(models.Model):
    interview = models.OneToOneField(Interview, on_delete=models.CASCADE, related_name='evaluation')
    
    # Video analysis (prototype)
    sentiment_score = models.FloatField(default=0.0)
    clarity_score = models.FloatField(default=0.0)
    keyword_matches = models.JSONField(default=list)
    
    overall_score = models.FloatField(default=0.0)
    feedback = models.TextField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'interview_evaluations'
