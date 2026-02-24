from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Resume
from .serializers import ResumeSerializer

class ResumeViewSet(viewsets.ModelViewSet):
    serializer_class = ResumeSerializer
    parser_classes = [MultiPartParser, FormParser]
    
    def get_queryset(self):
        if self.request.user.role == 'recruiter' or self.request.user.role == 'admin':
            return Resume.objects.all()
        return Resume.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        resume = serializer.save(user=self.request.user)
        
        # Parse resume asynchronously (or synchronously for now)
        try:
            from ai_engine.resume_parser import ResumeParser
            parser = ResumeParser()
            parsed_data = parser.parse_resume(resume.file.path)
            
            resume.parsed_data = parsed_data
            resume.name = parsed_data.get('name', '')
            resume.email = parsed_data.get('email', '')
            resume.phone = parsed_data.get('phone', '')
            resume.is_processed = True
            resume.save()
        except Exception as e:
            resume.processing_error = str(e)
            resume.save()
    
    @action(detail=True, methods=['post'])
    def reparse(self, request, pk=None):
        resume = self.get_object()
        
        try:
            from ai_engine.resume_parser import ResumeParser
            parser = ResumeParser()
            parsed_data = parser.parse_resume(resume.file.path)
            
            resume.parsed_data = parsed_data
            resume.name = parsed_data.get('name', '')
            resume.email = parsed_data.get('email', '')
            resume.phone = parsed_data.get('phone', '')
            resume.is_processed = True
            resume.processing_error = ''
            resume.save()
            
            return Response(ResumeSerializer(resume).data)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
