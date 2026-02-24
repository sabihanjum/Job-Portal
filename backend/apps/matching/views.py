from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from apps.resumes.models import Resume
from apps.jobs.models import Job
from .models import Match
from .serializers import MatchSerializer

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def match_resume_to_jobs(request):
    """Match a resume to one or more jobs"""
    resume_id = request.data.get('resume_id')
    job_ids = request.data.get('job_ids', [])
    
    if not resume_id:
        return Response({'error': 'resume_id is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        resume = Resume.objects.get(id=resume_id)
    except Resume.DoesNotExist:
        return Response({'error': 'Resume not found'}, status=status.HTTP_404_NOT_FOUND)
    
    # If no job_ids provided, match against all active jobs
    if not job_ids:
        jobs = Job.objects.filter(is_active=True)[:10]
    else:
        jobs = Job.objects.filter(id__in=job_ids, is_active=True)
    
    from ai_engine.semantic_matcher import SemanticMatcher
    matcher = SemanticMatcher()
    results = []
    
    for job in jobs:
        # Check if match already exists
        existing_match = Match.objects.filter(resume=resume, job=job).first()
        
        if existing_match:
            results.append(MatchSerializer(existing_match).data)
            continue
        
        # Perform matching
        match_result = matcher.match_resume_to_job(
            resume.parsed_data,
            {
                'title': job.title,
                'description': job.description,
                'requirements': job.requirements,
                'required_skills': job.required_skills
            }
        )
        
        # Save match
        match = Match.objects.create(
            resume=resume,
            job=job,
            match_percentage=match_result['match_percentage'],
            matched_skills=match_result['matched_skills'],
            missing_skills=match_result['missing_skills'],
            heatmap=match_result['heatmap'],
            recommendation=match_result['recommendation']
        )
        
        results.append(MatchSerializer(match).data)
    
    return Response({'matches': results})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def detect_bias(request):
    """Detect bias in job description"""
    text = request.data.get('text', '')
    
    if not text:
        return Response({'error': 'text is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    from ai_engine.bias_detector import BiasDetector
    detector = BiasDetector()
    result = detector.detect_bias(text)
    
    return Response(result)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def detect_fraud(request):
    """Detect fraud in resume"""
    resume_id = request.data.get('resume_id')
    
    if not resume_id:
        return Response({'error': 'resume_id is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        resume = Resume.objects.get(id=resume_id)
    except Resume.DoesNotExist:
        return Response({'error': 'Resume not found'}, status=status.HTTP_404_NOT_FOUND)
    
    from ai_engine.fraud_detector import FraudDetector
    detector = FraudDetector()
    result = detector.detect_fraud(resume.parsed_data)
    
    return Response(result)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def generate_learning_path(request):
    """Generate skill-gap learning path"""
    missing_skills = request.data.get('missing_skills', [])
    
    if not missing_skills:
        return Response({'error': 'missing_skills is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Generate learning resources (static for now)
    learning_path = []
    
    resources_map = {
        'python': {'platform': 'Coursera', 'course': 'Python for Everybody', 'duration': '8 weeks'},
        'javascript': {'platform': 'freeCodeCamp', 'course': 'JavaScript Algorithms', 'duration': '300 hours'},
        'react': {'platform': 'Udemy', 'course': 'React - The Complete Guide', 'duration': '40 hours'},
        'django': {'platform': 'Django Documentation', 'course': 'Official Tutorial', 'duration': '4 weeks'},
        'machine learning': {'platform': 'Coursera', 'course': 'Machine Learning by Andrew Ng', 'duration': '11 weeks'},
    }
    
    for skill in missing_skills:
        skill_lower = skill.lower()
        if skill_lower in resources_map:
            learning_path.append({
                'skill': skill,
                **resources_map[skill_lower]
            })
        else:
            learning_path.append({
                'skill': skill,
                'platform': 'YouTube/Google',
                'course': f'Search for "{skill} tutorial"',
                'duration': 'Varies'
            })
    
    return Response({'learning_path': learning_path})
