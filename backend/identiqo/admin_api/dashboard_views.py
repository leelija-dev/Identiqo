from datetime import timedelta
from decimal import Decimal

from django.contrib.auth.hashers import check_password
from django.db.models import Count, Sum
from django.shortcuts import get_object_or_404, redirect, render
from django.utils import timezone
from django.views.decorators.http import require_http_methods

from web_api.models import Users

from .decorators import admin_login_required
from .forms import (
    AdminLoginForm,
    AdminUserForm,
    BlogPostForm,
    CardTemplateForm,
    ContactSubmissionForm,
    OrganizationForm,
    PlatformSettingForm,
    SubscriptionPlanForm,
    UserForm,
)
from .models import (
    AdminUser,
    AuditLog,
    BlogPost,
    CardTemplate,
    ContactSubmission,
    Organization,
    PlatformSetting,
    Subscription,
    SubscriptionPayment,
    SubscriptionPlan,
)
from .utils import log_admin_action


def _paginate(queryset, request, per_page=20):
    try:
        page = max(1, int(request.GET.get('page', 1)))
    except ValueError:
        page = 1
    start = (page - 1) * per_page
    end = start + per_page
    total = queryset.count()
    return queryset[start:end], page, total, per_page


@require_http_methods(['GET', 'POST'])
def login_view(request):
    if request.session.get('admin_id'):
        return redirect('super_admin:dashboard')

    form = AdminLoginForm(request.POST or None)
    error = None

    if request.method == 'POST' and form.is_valid():
        email = form.cleaned_data['email']
        password = form.cleaned_data['password']
        try:
            admin = AdminUser.objects.get(email=email)
        except AdminUser.DoesNotExist:
            error = 'Invalid email or password.'
        else:
            if not admin.status:
                error = 'Account is inactive.'
            elif not check_password(password, admin.password):
                error = 'Invalid email or password.'
            else:
                request.session['admin_id'] = admin.id
                request.session.set_expiry(60 * 60 * 12)
                request.admin_user = admin
                log_admin_action(request, 'login', 'AdminUser', admin.id)
                return redirect('super_admin:dashboard')

    return render(request, 'super_admin/login.html', {'form': form, 'error': error})


def logout_view(request):
    if request.session.get('admin_id'):
        log_admin_action(request, 'logout', 'AdminUser', request.session.get('admin_id'))
    request.session.flush()
    return redirect('super_admin:login')


@admin_login_required
def dashboard_home(request):
    now = timezone.now()
    month_ago = now - timedelta(days=30)

    stats = {
        'users_total': Users.objects.count(),
        'users_new_month': Users.objects.filter(created_at__gte=month_ago).count(),
        'organizations_total': Organization.objects.count(),
        'templates_total': CardTemplate.objects.count(),
        'templates_published': CardTemplate.objects.filter(is_published=True).count(),
        'subscriptions_active': Subscription.objects.filter(status='active').count(),
        'contact_new': ContactSubmission.objects.filter(status='new').count(),
        'blog_published': BlogPost.objects.filter(is_published=True).count(),
        'revenue_month': SubscriptionPayment.objects.filter(
            status='success',
            created_at__gte=month_ago,
        ).aggregate(total=Sum('amount'))['total'] or Decimal('0'),
    }

    recent_users = Users.objects.order_by('-created_at')[:8]
    recent_contacts = ContactSubmission.objects.order_by('-created_at')[:5]
    recent_audit = AuditLog.objects.select_related('admin').order_by('-created_at')[:10]
    plan_breakdown = (
        Organization.objects.values('plan_tier')
        .annotate(count=Count('id'))
        .order_by('-count')
    )

    return render(request, 'super_admin/dashboard.html', {
        'stats': stats,
        'recent_users': recent_users,
        'recent_contacts': recent_contacts,
        'recent_audit': recent_audit,
        'plan_breakdown': plan_breakdown,
    })


@admin_login_required
def users_list(request):
    q = request.GET.get('q', '').strip()
    qs = Users.objects.all().order_by('-created_at')
    if q:
        qs = qs.filter(name__icontains=q) | qs.filter(email__icontains=q)
    users, page, total, per_page = _paginate(qs, request)
    return render(request, 'super_admin/users/list.html', {
        'users': users,
        'q': q,
        'page': page,
        'total': total,
        'per_page': per_page,
        'total_pages': (total + per_page - 1) // per_page,
    })


@admin_login_required
@require_http_methods(['GET', 'POST'])
def user_create(request):
    form = UserForm(request.POST or None)
    if request.method == 'POST' and form.is_valid():
        user = form.save()
        log_admin_action(request, 'create', 'Users', user.id)
        return redirect('super_admin:users_list')
    return render(request, 'super_admin/users/form.html', {
        'form': form,
        'title': 'Add Customer',
    })


@admin_login_required
@require_http_methods(['GET', 'POST'])
def user_edit(request, pk):
    user = get_object_or_404(Users, pk=pk)
    form = UserForm(request.POST or None, instance=user)
    if request.method == 'POST' and form.is_valid():
        form.save()
        log_admin_action(request, 'update', 'Users', user.id)
        return redirect('super_admin:users_list')
    return render(request, 'super_admin/users/form.html', {
        'form': form,
        'title': f'Edit {user.name}',
        'user_obj': user,
    })


@admin_login_required
@require_http_methods(['POST'])
def user_delete(request, pk):
    user = get_object_or_404(Users, pk=pk)
    uid = user.id
    user.delete()
    log_admin_action(request, 'delete', 'Users', uid)
    return redirect('super_admin:users_list')


@admin_login_required
def organizations_list(request):
    qs = Organization.objects.select_related('owner').order_by('-created_at')
    orgs, page, total, per_page = _paginate(qs, request)
    return render(request, 'super_admin/organizations/list.html', {
        'organizations': orgs,
        'page': page,
        'total': total,
        'per_page': per_page,
        'total_pages': (total + per_page - 1) // per_page,
    })


@admin_login_required
@require_http_methods(['GET', 'POST'])
def organization_create(request):
    form = OrganizationForm(request.POST or None)
    if request.method == 'POST' and form.is_valid():
        org = form.save()
        log_admin_action(request, 'create', 'Organization', org.id)
        return redirect('super_admin:organizations_list')
    return render(request, 'super_admin/organizations/form.html', {
        'form': form,
        'title': 'Add Organization',
    })


@admin_login_required
@require_http_methods(['GET', 'POST'])
def organization_edit(request, pk):
    org = get_object_or_404(Organization, pk=pk)
    form = OrganizationForm(request.POST or None, instance=org)
    if request.method == 'POST' and form.is_valid():
        form.save()
        log_admin_action(request, 'update', 'Organization', org.id)
        return redirect('super_admin:organizations_list')
    return render(request, 'super_admin/organizations/form.html', {
        'form': form,
        'title': f'Edit {org.name}',
    })


@admin_login_required
def templates_list(request):
    q = request.GET.get('q', '').strip()
    category = request.GET.get('category', '')
    qs = CardTemplate.objects.all()
    if q:
        qs = qs.filter(name__icontains=q)
    if category:
        qs = qs.filter(category=category)
    templates, page, total, per_page = _paginate(qs, request)
    return render(request, 'super_admin/templates/list.html', {
        'templates': templates,
        'q': q,
        'category': category,
        'page': page,
        'total': total,
        'per_page': per_page,
        'total_pages': (total + per_page - 1) // per_page,
    })


@admin_login_required
@require_http_methods(['GET', 'POST'])
def template_create(request):
    form = CardTemplateForm(request.POST or None)
    if request.method == 'POST' and form.is_valid():
        tpl = form.save()
        log_admin_action(request, 'create', 'CardTemplate', tpl.id)
        return redirect('super_admin:templates_list')
    return render(request, 'super_admin/templates/form.html', {
        'form': form,
        'title': 'Add Template',
    })


@admin_login_required
@require_http_methods(['GET', 'POST'])
def template_edit(request, pk):
    tpl = get_object_or_404(CardTemplate, pk=pk)
    form = CardTemplateForm(request.POST or None, instance=tpl)
    if request.method == 'POST' and form.is_valid():
        form.save()
        log_admin_action(request, 'update', 'CardTemplate', tpl.id)
        return redirect('super_admin:templates_list')
    return render(request, 'super_admin/templates/form.html', {
        'form': form,
        'title': f'Edit {tpl.name}',
    })


@admin_login_required
@require_http_methods(['POST'])
def template_delete(request, pk):
    tpl = get_object_or_404(CardTemplate, pk=pk)
    tid = tpl.id
    tpl.delete()
    log_admin_action(request, 'delete', 'CardTemplate', tid)
    return redirect('super_admin:templates_list')


@admin_login_required
def plans_list(request):
    plans = SubscriptionPlan.objects.all()
    return render(request, 'super_admin/plans/list.html', {'plans': plans})


@admin_login_required
@require_http_methods(['GET', 'POST'])
def plan_create(request):
    form = SubscriptionPlanForm(request.POST or None)
    if request.method == 'POST' and form.is_valid():
        plan = form.save()
        log_admin_action(request, 'create', 'SubscriptionPlan', plan.id)
        return redirect('super_admin:plans_list')
    return render(request, 'super_admin/plans/form.html', {
        'form': form,
        'title': 'Add Plan',
    })


@admin_login_required
@require_http_methods(['GET', 'POST'])
def plan_edit(request, pk):
    plan = get_object_or_404(SubscriptionPlan, pk=pk)
    form = SubscriptionPlanForm(request.POST or None, instance=plan)
    if request.method == 'POST' and form.is_valid():
        form.save()
        log_admin_action(request, 'update', 'SubscriptionPlan', plan.id)
        return redirect('super_admin:plans_list')
    return render(request, 'super_admin/plans/form.html', {
        'form': form,
        'title': f'Edit {plan.name}',
    })


@admin_login_required
def subscriptions_list(request):
    status = request.GET.get('status', '')
    qs = Subscription.objects.select_related('user', 'plan', 'organization').order_by('-created_at')
    if status:
        qs = qs.filter(status=status)
    subs, page, total, per_page = _paginate(qs, request)
    return render(request, 'super_admin/subscriptions/list.html', {
        'subscriptions': subs,
        'status': status,
        'page': page,
        'total': total,
        'per_page': per_page,
        'total_pages': (total + per_page - 1) // per_page,
    })


@admin_login_required
def payments_list(request):
    qs = SubscriptionPayment.objects.select_related(
        'subscription__user', 'subscription__plan',
    ).order_by('-created_at')
    payments, page, total, per_page = _paginate(qs, request)
    return render(request, 'super_admin/payments/list.html', {
        'payments': payments,
        'page': page,
        'total': total,
        'per_page': per_page,
        'total_pages': (total + per_page - 1) // per_page,
    })


@admin_login_required
def contact_list(request):
    status = request.GET.get('status', '')
    qs = ContactSubmission.objects.all()
    if status:
        qs = qs.filter(status=status)
    contacts, page, total, per_page = _paginate(qs, request)
    return render(request, 'super_admin/contact/list.html', {
        'contacts': contacts,
        'status': status,
        'page': page,
        'total': total,
        'per_page': per_page,
        'total_pages': (total + per_page - 1) // per_page,
    })


@admin_login_required
@require_http_methods(['GET', 'POST'])
def contact_detail(request, pk):
    contact = get_object_or_404(ContactSubmission, pk=pk)
    form = ContactSubmissionForm(request.POST or None, instance=contact)
    if request.method == 'POST' and form.is_valid():
        form.save()
        log_admin_action(request, 'update', 'ContactSubmission', contact.id)
        return redirect('super_admin:contact_list')
    return render(request, 'super_admin/contact/detail.html', {
        'contact': contact,
        'form': form,
    })


@admin_login_required
def blog_list(request):
    posts, page, total, per_page = _paginate(BlogPost.objects.all(), request)
    return render(request, 'super_admin/blog/list.html', {
        'posts': posts,
        'page': page,
        'total': total,
        'per_page': per_page,
        'total_pages': (total + per_page - 1) // per_page,
    })


@admin_login_required
@require_http_methods(['GET', 'POST'])
def blog_create(request):
    form = BlogPostForm(request.POST or None)
    if request.method == 'POST' and form.is_valid():
        post = form.save()
        log_admin_action(request, 'create', 'BlogPost', post.id)
        return redirect('super_admin:blog_list')
    return render(request, 'super_admin/blog/form.html', {
        'form': form,
        'title': 'New Blog Post',
    })


@admin_login_required
@require_http_methods(['GET', 'POST'])
def blog_edit(request, pk):
    post = get_object_or_404(BlogPost, pk=pk)
    form = BlogPostForm(request.POST or None, instance=post)
    if request.method == 'POST' and form.is_valid():
        form.save()
        log_admin_action(request, 'update', 'BlogPost', post.id)
        return redirect('super_admin:blog_list')
    return render(request, 'super_admin/blog/form.html', {
        'form': form,
        'title': f'Edit {post.title}',
    })


@admin_login_required
@require_http_methods(['POST'])
def blog_delete(request, pk):
    post = get_object_or_404(BlogPost, pk=pk)
    pid = post.id
    post.delete()
    log_admin_action(request, 'delete', 'BlogPost', pid)
    return redirect('super_admin:blog_list')


@admin_login_required
def audit_list(request):
    logs, page, total, per_page = _paginate(
        AuditLog.objects.select_related('admin'), request, per_page=30,
    )
    return render(request, 'super_admin/audit/list.html', {
        'logs': logs,
        'page': page,
        'total': total,
        'per_page': per_page,
        'total_pages': (total + per_page - 1) // per_page,
    })


@admin_login_required
def admins_list(request):
    admins = AdminUser.objects.order_by('-created_at')
    return render(request, 'super_admin/admins/list.html', {'admins': admins})


@admin_login_required
@require_http_methods(['GET', 'POST'])
def admin_create(request):
    form = AdminUserForm(request.POST or None)
    if request.method == 'POST' and form.is_valid():
        if not form.cleaned_data.get('password'):
            form.add_error('password', 'Password is required for new admins.')
        else:
            admin = form.save()
            log_admin_action(request, 'create', 'AdminUser', admin.id)
            return redirect('super_admin:admins_list')
    return render(request, 'super_admin/admins/form.html', {
        'form': form,
        'title': 'Add Admin',
    })


@admin_login_required
def settings_list(request):
    settings = PlatformSetting.objects.all()
    maintenance = settings.filter(key='maintenance_mode').first()
    maintenance_enabled = False
    if maintenance and isinstance(maintenance.value, dict):
        maintenance_enabled = bool(maintenance.value.get('enabled'))
    return render(request, 'super_admin/settings/list.html', {
        'settings': settings,
        'maintenance': maintenance,
        'maintenance_enabled': maintenance_enabled,
    })


@admin_login_required
@require_http_methods(['GET', 'POST'])
def setting_create(request):
    form = PlatformSettingForm(request.POST or None)
    if request.method == 'POST' and form.is_valid():
        setting = form.save()
        log_admin_action(request, 'create', 'PlatformSetting', setting.key)
        return redirect('super_admin:settings_list')
    return render(request, 'super_admin/settings/form.html', {
        'form': form,
        'title': 'Add Setting',
    })


@admin_login_required
@require_http_methods(['POST'])
def toggle_maintenance(request):
    setting, _ = PlatformSetting.objects.get_or_create(
        key='maintenance_mode',
        defaults={'value': {'enabled': False}, 'description': 'Platform maintenance toggle'},
    )
    enabled = setting.value.get('enabled', False) if isinstance(setting.value, dict) else False
    setting.value = {'enabled': not enabled}
    setting.save()
    log_admin_action(request, 'toggle_maintenance', 'PlatformSetting', setting.key, {
        'enabled': setting.value['enabled'],
    })
    return redirect('super_admin:settings_list')
