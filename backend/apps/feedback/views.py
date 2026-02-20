from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from apps.resumes.models import Resume, ResumeCorrection
from .models import AuditLog
from .utils import log_audit, get_client_ip

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def submit_correction(request):
    """Submit human-in-the-loop correction for parsed resume"""
    resume_id = request.data.get('resume_id')
    corrections = request.data.get('corrections', [])
    
    if not resume_id or not corrections:
        return Response({'error': 'resume_id and corrections are required'}, 
                        status=status.HTTP_400_BAD_REQUEST)
    
    try:
        resume = Resume.objects.get(id=resume_id)
    except Resume.DoesNotExist:
        return Response({'error': 'Resume not found'}, status=status.HTTP_404_NOT_FOUND)
    
    # Apply corrections
    for correction in corrections:
        field_name = correction.get('field')
        new_value = correction.get('value')
        
        if field_name in resume.parsed_data:
            old_value = resume.parsed_data[field_name]
            
            # Save correction history
            ResumeCorrection.objects.create(
                resume=resume,
                corrected_by=request.user,
                field_name=field_name,
                old_value=str(old_value),
                new_value=str(new_value)
            )
            
            # Update parsed data
            resume.parsed_data[field_name] = new_value
            
            # Update direct fields if applicable
            if field_name == 'name':
                resume.name = new_value
            elif field_name == 'email':
                resume.email = new_value
            elif field_name == 'phone':
                resume.phone = new_value
    
    resume.save()
    
    # Log audit with IP address
    log_audit(
        user=request.user,
        action='resume_correction',
        model_name='Resume',
        object_id=resume.id,
        changes={'corrections': corrections},
        request=request
    )
    
    return Response({'message': 'Corrections applied successfully'})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_audit_logs(request):
    """Get audit logs (admin/recruiter only)"""
    if request.user.role not in ['admin', 'recruiter']:
        return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
    
    logs = AuditLog.objects.all()[:100]
    
    data = [{
        'id': log.id,
        'user': log.user.username,
        'action': log.action,
        'model_name': log.model_name,
        'object_id': log.object_id,
        'changes': log.changes,
        'ip_address': log.ip_address,
        'timestamp': log.timestamp
    } for log in logs]
    
    return Response({'logs': data})
