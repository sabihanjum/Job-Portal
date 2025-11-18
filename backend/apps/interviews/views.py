from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Interview, InterviewEvaluation
from .serializers import InterviewSerializer, InterviewEvaluationSerializer
from apps.jobs.models import JobApplication

class InterviewViewSet(viewsets.ModelViewSet):
    serializer_class = InterviewSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        if self.request.user.role in ['recruiter', 'admin']:
            return Interview.objects.all()
        return Interview.objects.filter(application__candidate=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(scheduled_by=self.request.user)
    
    @action(detail=True, methods=['post'])
    def generate_questions(self, request, pk=None):
        """Generate interview questions based on job and resume"""
        interview = self.get_object()
        application = interview.application
        job = application.job
        resume = application.resume
        
        questions = self._generate_questions(job, resume.parsed_data)
        
        interview.questions = questions
        interview.save()
        
        return Response({'questions': questions})
    
    def _generate_questions(self, job, resume_data):
        """Generate technical and behavioral questions"""
        questions = []
        
        # Technical questions based on required skills
        for skill in job.required_skills[:5]:
            questions.append({
                'type': 'technical',
                'skill': skill,
                'question': f"Can you explain your experience with {skill}? Provide a specific example."
            })
        
        # Behavioral questions
        behavioral = [
            "Tell me about a challenging project you worked on and how you overcame obstacles.",
            "Describe a situation where you had to work with a difficult team member.",
            "How do you prioritize tasks when working on multiple projects?",
            "Give an example of when you had to learn a new technology quickly.",
        ]
        
        for q in behavioral:
            questions.append({
                'type': 'behavioral',
                'question': q
            })
        
        return questions

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def schedule_interview(request):
    """Schedule an interview for a job application"""
    # Accept both application_id and application for flexibility
    application_id = request.data.get('application_id') or request.data.get('application')
    # Accept both scheduled_date and scheduled_time for flexibility
    scheduled_date = request.data.get('scheduled_date') or request.data.get('scheduled_time')
    
    if not application_id or not scheduled_date:
        return Response({
            'error': 'application and scheduled_time are required',
            'received': request.data
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        application = JobApplication.objects.get(id=application_id)
    except JobApplication.DoesNotExist:
        return Response({'error': 'Application not found'}, status=status.HTTP_404_NOT_FOUND)
    
    interview = Interview.objects.create(
        application=application,
        scheduled_by=request.user,
        scheduled_date=scheduled_date,
        interview_type=request.data.get('interview_type', 'video'),
        duration_minutes=request.data.get('duration_minutes', 60),
        meeting_link=request.data.get('meeting_link', ''),
        notes=request.data.get('notes', '')
    )
    
    return Response(InterviewSerializer(interview).data, status=status.HTTP_201_CREATED)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def evaluate_interview(request, interview_id):
    """Evaluate interview (prototype - mocked AI evaluation)"""
    try:
        interview = Interview.objects.get(id=interview_id)
    except Interview.DoesNotExist:
        return Response({'error': 'Interview not found'}, status=status.HTTP_404_NOT_FOUND)
    
    # Mock evaluation (in production, this would analyze video/audio)
    evaluation = InterviewEvaluation.objects.create(
        interview=interview,
        sentiment_score=0.75,
        clarity_score=0.80,
        keyword_matches=['python', 'django', 'api'],
        overall_score=0.77,
        feedback="Candidate demonstrated good technical knowledge and communication skills."
    )
    
    return Response(InterviewEvaluationSerializer(evaluation).data)
