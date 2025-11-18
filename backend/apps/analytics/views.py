from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Count, Avg, Q
from apps.jobs.models import Job, JobApplication
from apps.resumes.models import Resume
from apps.matching.models import Match
from apps.interviews.models import Interview

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_analytics(request):
    """Get comprehensive analytics for dashboard"""
    
    # Applications per job
    applications_per_job = list(JobApplication.objects.values('job__title', 'job__company')
                                .annotate(count=Count('id'))
                                .order_by('-count')[:10])
    
    # Average match scores
    avg_match_score = Match.objects.aggregate(avg=Avg('match_percentage'))['avg'] or 0
    
    # Most common skills
    all_skills = []
    for resume in Resume.objects.filter(is_processed=True):
        all_skills.extend(resume.parsed_data.get('skills', []))
    
    from collections import Counter
    skill_counts = Counter(all_skills)
    most_common_skills = [{'skill': skill, 'count': count} 
                          for skill, count in skill_counts.most_common(15)]
    
    # Pipeline analytics
    pipeline_stats = {
        'total_applications': JobApplication.objects.count(),
        'screening': JobApplication.objects.filter(status='screening').count(),
        'interview': JobApplication.objects.filter(status='interview').count(),
        'accepted': JobApplication.objects.filter(status='accepted').count(),
        'rejected': JobApplication.objects.filter(status='rejected').count(),
    }
    
    # Time-to-shortlist (mock calculation)
    time_to_shortlist = 3.5  # days (would calculate from actual data)
    
    # Bias detection stats
    bias_stats = {
        'jobs_analyzed': Job.objects.count(),
        'jobs_with_bias': 0,  # Would track this in production
    }
    
    # Fraud detection stats
    fraud_stats = {
        'resumes_analyzed': Resume.objects.filter(is_processed=True).count(),
        'suspicious_resumes': 0,  # Would track this in production
    }
    
    # Interview stats
    interview_stats = {
        'total_scheduled': Interview.objects.count(),
        'completed': Interview.objects.filter(status='completed').count(),
        'upcoming': Interview.objects.filter(status='scheduled').count(),
    }
    
    # Match score distribution
    match_distribution = {
        'excellent': Match.objects.filter(match_percentage__gte=80).count(),
        'good': Match.objects.filter(match_percentage__gte=60, match_percentage__lt=80).count(),
        'moderate': Match.objects.filter(match_percentage__gte=40, match_percentage__lt=60).count(),
        'low': Match.objects.filter(match_percentage__lt=40).count(),
    }
    
    return Response({
        'applications_per_job': applications_per_job,
        'avg_match_score': round(avg_match_score, 2),
        'most_common_skills': most_common_skills,
        'pipeline_stats': pipeline_stats,
        'time_to_shortlist_days': time_to_shortlist,
        'bias_stats': bias_stats,
        'fraud_stats': fraud_stats,
        'interview_stats': interview_stats,
        'match_distribution': match_distribution,
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def job_analytics(request, job_id):
    """Get analytics for a specific job"""
    try:
        job = Job.objects.get(id=job_id)
    except Job.DoesNotExist:
        return Response({'error': 'Job not found'}, status=404)
    
    applications = JobApplication.objects.filter(job=job)
    
    analytics = {
        'job_title': job.title,
        'total_applications': applications.count(),
        'avg_match_score': applications.aggregate(avg=Avg('match_score'))['avg'] or 0,
        'status_breakdown': {
            'applied': applications.filter(status='applied').count(),
            'screening': applications.filter(status='screening').count(),
            'interview': applications.filter(status='interview').count(),
            'accepted': applications.filter(status='accepted').count(),
            'rejected': applications.filter(status='rejected').count(),
        },
        'top_candidates': list(applications.order_by('-match_score')[:5].values(
            'candidate__username', 'match_score', 'status'
        ))
    }
    
    return Response(analytics)
