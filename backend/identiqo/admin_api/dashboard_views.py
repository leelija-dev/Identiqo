import json
from datetime import timedelta
from decimal import Decimal

from django.contrib.auth.hashers import check_password
from django.db.models import Count, Sum
from django.shortcuts import redirect
from django.urls import reverse_lazy
from django.utils.decorators import method_decorator
from django.utils import timezone
from django.views.generic import (
    CreateView, DeleteView, FormView, ListView, TemplateView, UpdateView, View
)

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


def _parse_json_field(value, field_name):
    """Helper function to parse JSON field"""
    if not value:
        return []
    try:
        parsed = json.loads(value)
        if isinstance(parsed, list):
            return parsed
        elif isinstance(parsed, dict):
            return parsed
        else:
            return []
    except json.JSONDecodeError:
        return []


# ==================== HTML DASHBOARD VIEWS (CLASS-BASED) ====================

class LoginView(FormView):
    template_name = 'super_admin/login.html'
    form_class = AdminLoginForm

    def dispatch(self, request, *args, **kwargs):
        if request.session.get('admin_id'):
            return redirect('super_admin:dashboard')
        return super().dispatch(request, *args, **kwargs)

    def form_valid(self, form):
        email = form.cleaned_data['email']
        password = form.cleaned_data['password']
        
        try:
            admin = AdminUser.objects.get(email=email)
        except AdminUser.DoesNotExist:
            return self.form_invalid(form)
        
        if not admin.status:
            form.add_error(None, 'Account is inactive.')
            return self.form_invalid(form)
        
        if not check_password(password, admin.password):
            form.add_error(None, 'Invalid email or password.')
            return self.form_invalid(form)
        
        self.request.session['admin_id'] = admin.id
        self.request.session.set_expiry(60 * 60 * 12)
        self.request.admin_user = admin
        log_admin_action(self.request, 'login', 'AdminUser', admin.id)
        
        return redirect('super_admin:dashboard')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['error'] = None
        return context


class LogoutView(View):
    def get(self, request):
        if request.session.get('admin_id'):
            log_admin_action(request, 'logout', 'AdminUser', request.session.get('admin_id'))
        request.session.flush()
        return redirect('super_admin:login')

    def post(self, request):
        return self.get(request)


class DashboardView(TemplateView):
    template_name = 'super_admin/dashboard.html'

    @method_decorator(admin_login_required)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        now = timezone.now()
        month_ago = now - timedelta(days=30)

        context['stats'] = {
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

        context['recent_users'] = Users.objects.order_by('-created_at')[:8]
        context['recent_contacts'] = ContactSubmission.objects.order_by('-created_at')[:5]
        context['recent_audit'] = AuditLog.objects.select_related('admin').order_by('-created_at')[:10]
        context['plan_breakdown'] = (
            Organization.objects.values('plan_tier')
            .annotate(count=Count('id'))
            .order_by('-count')
        )
        
        return context


class UserListView(ListView):
    model = Users
    template_name = 'super_admin/users/list.html'
    context_object_name = 'users'
    paginate_by = 20

    @method_decorator(admin_login_required)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def get_queryset(self):
        qs = Users.objects.all().order_by('-created_at')
        q = self.request.GET.get('q', '').strip()
        if q:
            qs = qs.filter(name__icontains=q) | qs.filter(email__icontains=q)
        return qs

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['q'] = self.request.GET.get('q', '')
        context['total'] = self.get_queryset().count()
        context['total_pages'] = (context['total'] + self.paginate_by - 1) // self.paginate_by
        return context


class UserCreateView(CreateView):
    model = Users
    form_class = UserForm
    template_name = 'super_admin/users/form.html'
    success_url = reverse_lazy('super_admin:users_list')

    @method_decorator(admin_login_required)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = 'Add Customer'
        return context

    def form_valid(self, form):
        user = form.save()
        log_admin_action(self.request, 'create', 'Users', user.id)
        return super().form_valid(form)


class UserUpdateView(UpdateView):
    model = Users
    form_class = UserForm
    template_name = 'super_admin/users/form.html'
    success_url = reverse_lazy('super_admin:users_list')
    pk_url_kwarg = 'pk'

    @method_decorator(admin_login_required)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = f'Edit {self.object.name}'
        context['user_obj'] = self.object
        return context

    def form_valid(self, form):
        log_admin_action(self.request, 'update', 'Users', self.object.id)
        return super().form_valid(form)


class UserDeleteView(DeleteView):
    model = Users
    success_url = reverse_lazy('super_admin:users_list')
    pk_url_kwarg = 'pk'

    @method_decorator(admin_login_required)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        user = self.get_object()
        uid = user.id
        log_admin_action(request, 'delete', 'Users', uid)
        return super().post(request, *args, **kwargs)


class OrganizationListView(ListView):
    model = Organization
    template_name = 'super_admin/organizations/list.html'
    context_object_name = 'organizations'
    paginate_by = 20

    @method_decorator(admin_login_required)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def get_queryset(self):
        return Organization.objects.select_related('owner').order_by('-created_at')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['total'] = self.get_queryset().count()
        context['total_pages'] = (context['total'] + self.paginate_by - 1) // self.paginate_by
        return context


class OrganizationCreateView(CreateView):
    model = Organization
    form_class = OrganizationForm
    template_name = 'super_admin/organizations/form.html'
    success_url = reverse_lazy('super_admin:organizations_list')

    @method_decorator(admin_login_required)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = 'Add Organization'
        return context

    def form_valid(self, form):
        org = form.save()
        log_admin_action(self.request, 'create', 'Organization', org.id)
        return super().form_valid(form)


class OrganizationUpdateView(UpdateView):
    model = Organization
    form_class = OrganizationForm
    template_name = 'super_admin/organizations/form.html'
    success_url = reverse_lazy('super_admin:organizations_list')
    pk_url_kwarg = 'pk'

    @method_decorator(admin_login_required)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = f'Edit {self.object.name}'
        return context

    def form_valid(self, form):
        log_admin_action(self.request, 'update', 'Organization', self.object.id)
        return super().form_valid(form)


class TemplateListView(ListView):
    model = CardTemplate
    template_name = 'super_admin/templates/list.html'
    context_object_name = 'templates'
    paginate_by = 20

    @method_decorator(admin_login_required)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def get_queryset(self):
        qs = CardTemplate.objects.all()
        q = self.request.GET.get('q', '').strip()
        category = self.request.GET.get('category', '')
        if q:
            qs = qs.filter(name__icontains=q)
        if category:
            qs = qs.filter(category=category)
        return qs

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['q'] = self.request.GET.get('q', '')
        context['category'] = self.request.GET.get('category', '')
        context['total'] = self.get_queryset().count()
        context['total_pages'] = (context['total'] + self.paginate_by - 1) // self.paginate_by
        return context


class TemplateCreateView(CreateView):
    model = CardTemplate
    form_class = CardTemplateForm
    template_name = 'super_admin/templates/form.html'
    success_url = reverse_lazy('super_admin:templates_list')

    @method_decorator(admin_login_required)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = 'Add Template'
        return context

    def form_valid(self, form):
        tpl = form.save()
        log_admin_action(self.request, 'create', 'CardTemplate', tpl.id)
        return super().form_valid(form)


class TemplateUpdateView(UpdateView):
    model = CardTemplate
    form_class = CardTemplateForm
    template_name = 'super_admin/templates/form.html'
    success_url = reverse_lazy('super_admin:templates_list')
    pk_url_kwarg = 'pk'

    @method_decorator(admin_login_required)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = f'Edit {self.object.name}'
        return context

    def form_valid(self, form):
        log_admin_action(self.request, 'update', 'CardTemplate', self.object.id)
        return super().form_valid(form)


class TemplateDeleteView(DeleteView):
    model = CardTemplate
    success_url = reverse_lazy('super_admin:templates_list')
    pk_url_kwarg = 'pk'

    @method_decorator(admin_login_required)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        tpl = self.get_object()
        tid = tpl.id
        log_admin_action(request, 'delete', 'CardTemplate', tid)
        return super().post(request, *args, **kwargs)


class PlanListView(ListView):
    model = SubscriptionPlan
    template_name = 'super_admin/plans/list.html'
    context_object_name = 'plans'

    @method_decorator(admin_login_required)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)


class PlanCreateView(FormView):
    template_name = 'super_admin/plans/form.html'
    form_class = SubscriptionPlanForm
    success_url = reverse_lazy('super_admin:plans_list')

    @method_decorator(admin_login_required)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = 'Add Plan'
        return context

    def form_valid(self, form):
        monthly_price = form.cleaned_data['monthly_price']
        yearly_price = form.cleaned_data['yearly_price']
        
        name = form.cleaned_data['name']
        base_code = name.lower().replace(' ', '_').replace('-', '_')
        
        monthly_plan = SubscriptionPlan.objects.create(
            name=name,
            code=f"{base_code}_monthly",
            price=monthly_price,
            currency=form.cleaned_data['currency'],
            billing_cycle='monthly',
            duration_days=30,
            description=form.cleaned_data['description'],
            features=form.cleaned_data['features'],
            is_active=form.cleaned_data['is_active'],
        )
        
        yearly_plan = SubscriptionPlan.objects.create(
            name=name,
            code=f"{base_code}_yearly",
            price=yearly_price,
            currency=form.cleaned_data['currency'],
            billing_cycle='yearly',
            duration_days=365,
            description=form.cleaned_data['description'],
            features=form.cleaned_data['features'],
            is_active=form.cleaned_data['is_active'],
        )
        
        log_admin_action(self.request, 'create', 'SubscriptionPlan', monthly_plan.id, {
            'monthly_id': monthly_plan.id,
            'yearly_id': yearly_plan.id,
        })
        
        return super().form_valid(form)


class PlanUpdateView(UpdateView):
    model = SubscriptionPlan
    template_name = 'super_admin/plans/edit_form.html'
    pk_url_kwarg = 'pk'
    success_url = reverse_lazy('super_admin:plans_list')

    @method_decorator(admin_login_required)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def get_form_class(self):
        from django import forms
        
        class EditPlanForm(forms.ModelForm):
            class Meta:
                model = SubscriptionPlan
                fields = ['name', 'code', 'price', 'currency', 'billing_cycle', 'duration_days', 'description', 'features', 'is_active']
                widgets = {
                    'name': forms.TextInput(attrs={'class': 'form-input'}),
                    'code': forms.TextInput(attrs={'class': 'form-input'}),
                    'price': forms.NumberInput(attrs={'class': 'form-input', 'step': '0.01'}),
                    'currency': forms.TextInput(attrs={'class': 'form-input'}),
                    'billing_cycle': forms.Select(attrs={'class': 'form-input'}),
                    'duration_days': forms.NumberInput(attrs={'class': 'form-input'}),
                    'description': forms.Textarea(attrs={'class': 'form-input', 'rows': 3}),
                    'is_active': forms.CheckboxInput(attrs={'class': 'form-checkbox'}),
                }
            
            features = forms.CharField(required=False, widget=forms.HiddenInput())
            
            def __init__(self, *args, **kwargs):
                super().__init__(*args, **kwargs)
                if self.instance and self.instance.pk and self.instance.features:
                    self.fields['features'].initial = json.dumps(self.instance.features)
            
            def clean_features(self):
                return _parse_json_field(self.cleaned_data.get('features'), 'Features')
        
        return EditPlanForm

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = f'Edit {self.object.name}'
        context['related_plans'] = SubscriptionPlan.objects.filter(
            code=self.object.code
        ).exclude(pk=self.object.pk)
        context['current_plan'] = self.object
        return context

    def form_valid(self, form):
        log_admin_action(self.request, 'update', 'SubscriptionPlan', self.object.id)
        return super().form_valid(form)


class PlanDeleteView(DeleteView):
    model = SubscriptionPlan
    template_name = 'super_admin/plans/delete_confirm.html'
    pk_url_kwarg = 'pk'
    success_url = reverse_lazy('super_admin:plans_list')

    @method_decorator(admin_login_required)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = f'Delete {self.object.name}'
        return context

    def post(self, request, *args, **kwargs):
        plan = self.get_object()
        log_admin_action(request, 'delete', 'SubscriptionPlan', plan.id)
        return super().post(request, *args, **kwargs)


class SubscriptionListView(ListView):
    model = Subscription
    template_name = 'super_admin/subscriptions/list.html'
    context_object_name = 'subscriptions'
    paginate_by = 20

    @method_decorator(admin_login_required)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def get_queryset(self):
        qs = Subscription.objects.select_related('user', 'plan', 'organization').order_by('-created_at')
        status = self.request.GET.get('status', '')
        if status:
            qs = qs.filter(status=status)
        return qs

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['status'] = self.request.GET.get('status', '')
        context['total'] = self.get_queryset().count()
        context['total_pages'] = (context['total'] + self.paginate_by - 1) // self.paginate_by
        return context


class PaymentListView(ListView):
    model = SubscriptionPayment
    template_name = 'super_admin/payments/list.html'
    context_object_name = 'payments'
    paginate_by = 20

    @method_decorator(admin_login_required)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def get_queryset(self):
        return SubscriptionPayment.objects.select_related(
            'subscription__user', 'subscription__plan',
        ).order_by('-created_at')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['total'] = self.get_queryset().count()
        context['total_pages'] = (context['total'] + self.paginate_by - 1) // self.paginate_by
        return context


class ContactListView(ListView):
    model = ContactSubmission
    template_name = 'super_admin/contact/list.html'
    context_object_name = 'contacts'
    paginate_by = 20

    @method_decorator(admin_login_required)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def get_queryset(self):
        qs = ContactSubmission.objects.all()
        status = self.request.GET.get('status', '')
        if status:
            qs = qs.filter(status=status)
        return qs

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['status'] = self.request.GET.get('status', '')
        context['total'] = self.get_queryset().count()
        context['total_pages'] = (context['total'] + self.paginate_by - 1) // self.paginate_by
        return context


class ContactDetailView(UpdateView):
    model = ContactSubmission
    form_class = ContactSubmissionForm
    template_name = 'super_admin/contact/detail.html'
    pk_url_kwarg = 'pk'
    success_url = reverse_lazy('super_admin:contact_list')

    @method_decorator(admin_login_required)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['contact'] = self.object
        return context

    def form_valid(self, form):
        log_admin_action(self.request, 'update', 'ContactSubmission', self.object.id)
        return super().form_valid(form)


class BlogListView(ListView):
    model = BlogPost
    template_name = 'super_admin/blog/list.html'
    context_object_name = 'posts'
    paginate_by = 20

    @method_decorator(admin_login_required)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['total'] = self.get_queryset().count()
        context['total_pages'] = (context['total'] + self.paginate_by - 1) // self.paginate_by
        return context


class BlogCreateView(CreateView):
    model = BlogPost
    form_class = BlogPostForm
    template_name = 'super_admin/blog/form.html'
    success_url = reverse_lazy('super_admin:blog_list')

    @method_decorator(admin_login_required)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = 'New Blog Post'
        return context

    def form_valid(self, form):
        post = form.save()
        log_admin_action(self.request, 'create', 'BlogPost', post.id)
        return super().form_valid(form)


class BlogUpdateView(UpdateView):
    model = BlogPost
    form_class = BlogPostForm
    template_name = 'super_admin/blog/form.html'
    pk_url_kwarg = 'pk'
    success_url = reverse_lazy('super_admin:blog_list')

    @method_decorator(admin_login_required)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = f'Edit {self.object.title}'
        return context

    def form_valid(self, form):
        log_admin_action(self.request, 'update', 'BlogPost', self.object.id)
        return super().form_valid(form)


class BlogDeleteView(DeleteView):
    model = BlogPost
    success_url = reverse_lazy('super_admin:blog_list')
    pk_url_kwarg = 'pk'

    @method_decorator(admin_login_required)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        post = self.get_object()
        pid = post.id
        log_admin_action(request, 'delete', 'BlogPost', pid)
        return super().post(request, *args, **kwargs)


class AuditListView(ListView):
    model = AuditLog
    template_name = 'super_admin/audit/list.html'
    context_object_name = 'logs'
    paginate_by = 30

    @method_decorator(admin_login_required)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def get_queryset(self):
        return AuditLog.objects.select_related('admin').order_by('-created_at')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['total'] = self.get_queryset().count()
        context['total_pages'] = (context['total'] + self.paginate_by - 1) // self.paginate_by
        return context


class AdminListView(ListView):
    model = AdminUser
    template_name = 'super_admin/admins/list.html'
    context_object_name = 'admins'

    @method_decorator(admin_login_required)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def get_queryset(self):
        return AdminUser.objects.order_by('-created_at')


class AdminCreateView(CreateView):
    model = AdminUser
    form_class = AdminUserForm
    template_name = 'super_admin/admins/form.html'
    success_url = reverse_lazy('super_admin:admins_list')

    @method_decorator(admin_login_required)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = 'Add Admin'
        return context

    def form_valid(self, form):
        if not form.cleaned_data.get('password'):
            form.add_error('password', 'Password is required for new admins.')
            return self.form_invalid(form)
        admin = form.save()
        log_admin_action(self.request, 'create', 'AdminUser', admin.id)
        return super().form_valid(form)


class SettingsListView(ListView):
    model = PlatformSetting
    template_name = 'super_admin/settings/list.html'
    context_object_name = 'settings'

    @method_decorator(admin_login_required)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        maintenance = PlatformSetting.objects.filter(key='maintenance_mode').first()
        maintenance_enabled = False
        if maintenance and isinstance(maintenance.value, dict):
            maintenance_enabled = bool(maintenance.value.get('enabled'))
        context['maintenance'] = maintenance
        context['maintenance_enabled'] = maintenance_enabled
        return context


class SettingCreateView(CreateView):
    model = PlatformSetting
    form_class = PlatformSettingForm
    template_name = 'super_admin/settings/form.html'
    success_url = reverse_lazy('super_admin:settings_list')

    @method_decorator(admin_login_required)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = 'Add Setting'
        return context

    def form_valid(self, form):
        setting = form.save()
        log_admin_action(self.request, 'create', 'PlatformSetting', setting.key)
        return super().form_valid(form)


class ToggleMaintenanceView(View):
    @method_decorator(admin_login_required)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def post(self, request):
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
