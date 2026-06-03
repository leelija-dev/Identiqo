from functools import wraps

from django.shortcuts import redirect

from .models import AdminUser


def admin_login_required(view_func):
    @wraps(view_func)
    def wrapper(request, *args, **kwargs):
        admin_id = request.session.get('admin_id')
        if not admin_id:
            return redirect('super_admin:login')

        try:
            request.admin_user = AdminUser.objects.get(pk=admin_id, status=True)
        except AdminUser.DoesNotExist:
            request.session.flush()
            return redirect('super_admin:login')

        return view_func(request, *args, **kwargs)

    return wrapper
