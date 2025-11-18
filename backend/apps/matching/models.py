from django.db import models
from django.conf import settings

class Match(models.Model):
    resume = models.ForeignKey('resumes.Resume', on_delete=models.CASCADE, related_name='matches')
    job = models.ForeignKey('jobs.Job', on_delete=models.CASCADE, related_name='matches')
    
    match_percentage = models.FloatField()
    matched_skills = models.JSONField(default=list)
    missing_skills = models.JSONField(default=list)
    heatmap = models.JSONField(default=list)
    recommendation = models.TextField()
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'matches'
        unique_together = ['resume', 'job']
        ordering = ['-match_percentage']
