from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import InterviewViewSet, schedule_interview, evaluate_interview

router = DefaultRouter()
router.register(r'', InterviewViewSet, basename='interview')

urlpatterns = [
    path('schedule/', schedule_interview, name='schedule-interview'),
    path('<int:interview_id>/evaluate/', evaluate_interview, name='evaluate-interview'),
    path('', include(router.urls)),
]
