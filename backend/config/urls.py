from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('apps.authentication.urls')),
    path('api/resumes/', include('apps.resumes.urls')),
    path('api/jobs/', include('apps.jobs.urls')),
    path('api/match/', include('apps.matching.urls')),
    path('api/interviews/', include('apps.interviews.urls')),
    path('api/analytics/', include('apps.analytics.urls')),
    path('api/feedback/', include('apps.feedback.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
