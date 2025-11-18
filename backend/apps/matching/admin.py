from django.contrib import admin
from .models import Match

@admin.register(Match)
class MatchAdmin(admin.ModelAdmin):
    list_display = ['id', 'resume', 'job', 'match_percentage', 'created_at']
    list_filter = ['created_at']
    search_fields = ['resume__name', 'job__title']
