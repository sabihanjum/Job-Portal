from django.contrib import admin
from .models import Interview, InterviewEvaluation

@admin.register(Interview)
class InterviewAdmin(admin.ModelAdmin):
    list_display = ['id', 'application', 'scheduled_date', 'status', 'scheduled_by']
    list_filter = ['status', 'scheduled_date']

@admin.register(InterviewEvaluation)
class InterviewEvaluationAdmin(admin.ModelAdmin):
    list_display = ['id', 'interview', 'overall_score', 'created_at']
