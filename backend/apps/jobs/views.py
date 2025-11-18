from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Job, JobApplication
from .serializers import JobSerializer, JobApplicationSerializer

class JobViewSet(viewsets.ModelViewSet):
    serializer_class = JobSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        queryset = Job.objects.filter(is_active=True)
        
        # Filter by skills
        skills = self.request.query_params.get('skills', None)
        if skills:
            skill_list = skills.split(',')
            queryset = queryset.filter(required_skills__overlap=skill_list)
        
        return queryset
    
    def perform_create(self, serializer):
        serializer.save(posted_by=self.request.user)
    
    @action(detail=True, methods=['post'])
    def apply(self, request, pk=None):
        job = self.get_object()
        resume_id = request.data.get('resume_id')
        
        if not resume_id:
            return Response({'error': 'resume_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        from apps.resumes.models import Resume
        from ai_engine.semantic_matcher import SemanticMatcher
        
        try:
            resume = Resume.objects.get(id=resume_id, user=request.user)
        except Resume.DoesNotExist:
            return Response({'error': 'Resume not found'}, status=status.HTTP_404_NOT_FOUND)
        
        # Check if already applied
        if JobApplication.objects.filter(job=job, candidate=request.user, resume=resume).exists():
            return Response({'error': 'Already applied'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Calculate match score
        match_score = 0.0
        try:
            matcher = SemanticMatcher()
            match_result = matcher.match_resume_to_job(
                resume.parsed_data,
                {
                    'title': job.title,
                    'description': job.description,
                    'requirements': job.requirements,
                    'required_skills': job.required_skills
                }
            )
            match_score = match_result['match_percentage']
        except Exception as e:
            print(f"Error calculating match score: {e}")
        
        application = JobApplication.objects.create(
            job=job,
            candidate=request.user,
            resume=resume,
            match_score=match_score
        )
        
        return Response(JobApplicationSerializer(application).data, status=status.HTTP_201_CREATED)

class JobApplicationViewSet(viewsets.ModelViewSet):
    serializer_class = JobApplicationSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        if self.request.user.role in ['recruiter', 'admin']:
            return JobApplication.objects.all()
        return JobApplication.objects.filter(candidate=self.request.user)
