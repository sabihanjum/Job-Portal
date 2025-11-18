from django.contrib import admin
from .models import Job, JobApplication

@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display = ['id', 'title', 'company', 'location', 'posted_by', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at', 'company']
    search_fields = ['title', 'company', 'description']

@admin.register(JobApplication)
class JobApplicationAdmin(admin.ModelAdmin):
    list_display = ['id', 'job', 'candidate', 'status', 'match_score', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['job__title', 'candidate__username']
