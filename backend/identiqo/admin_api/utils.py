from .models import AuditLog


def log_admin_action(request, action, entity_type, entity_id='', metadata=None):
    admin = getattr(request, 'admin_user', None)
    ip = request.META.get('REMOTE_ADDR')
    AuditLog.objects.create(
        admin=admin,
        action=action,
        entity_type=entity_type,
        entity_id=str(entity_id) if entity_id else '',
        metadata=metadata or {},
        ip_address=ip,
    )
