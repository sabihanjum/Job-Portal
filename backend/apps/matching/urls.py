from django.urls import path
from .views import match_resume_to_jobs, detect_bias, detect_fraud, generate_learning_path

urlpatterns = [
    path('', match_resume_to_jobs, name='match'),
    path('bias/', detect_bias, name='detect-bias'),
    path('fraud/', detect_fraud, name='detect-fraud'),
    path('learning-path/', generate_learning_path, name='learning-path'),
]
