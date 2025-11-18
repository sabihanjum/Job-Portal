from django.urls import path
from .views import submit_correction, get_audit_logs

urlpatterns = [
    path('correction/', submit_correction, name='submit-correction'),
    path('audit-logs/', get_audit_logs, name='audit-logs'),
]
