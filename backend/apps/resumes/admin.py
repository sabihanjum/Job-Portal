from django.contrib import admin
from .models import Resume, ResumeCorrection

@admin.register(Resume)
class ResumeAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'name', 'email', 'is_processed', 'created_at']
    list_filter = ['is_processed', 'created_at']
    search_fields = ['name', 'email', 'user__username']

@admin.register(ResumeCorrection)
class ResumeCorrectionAdmin(admin.ModelAdmin):
    list_display = ['id', 'resume', 'field_name', 'corrected_by', 'created_at']
    list_filter = ['field_name', 'created_at']
