from django.urls import path
from .views import dashboard_analytics, job_analytics

urlpatterns = [
    path('dashboard/', dashboard_analytics, name='dashboard-analytics'),
    path('job/<int:job_id>/', job_analytics, name='job-analytics'),
]
