def get_client_ip(request):
    """
    Get client IP address from request
    """
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip


def log_audit(user, action, model_name, object_id, changes, request=None):
    """
    Log an audit action
    """
    from .models import AuditLog
    
    ip_address = None
    if request:
        ip_address = get_client_ip(request)
    
    return AuditLog.objects.create(
        user=user,
        action=action,
        model_name=model_name,
        object_id=object_id,
        changes=changes,
        ip_address=ip_address
    )
