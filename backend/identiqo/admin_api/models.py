from django.db import models
from web_api.models import Users


class AdminUser(models.Model):
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)
    full_name = models.CharField(max_length=150, blank=True, null=True)
    phone = models.CharField(max_length=15, blank=True, null=True)
    status = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'admin_users'

    def __str__(self):
        return self.email or str(self.id)


class Organization(models.Model):
    PLAN_CHOICES = (
        ('free', 'Free'),
        ('essential', 'Essential'),
        ('professional', 'Professional'),
        ('enterprise', 'Enterprise'),
    )

    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=100, unique=True)
    owner = models.ForeignKey(
        Users,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='owned_organizations',
    )
    plan_tier = models.CharField(max_length=20, choices=PLAN_CHOICES, default='free')
    employee_id_limit = models.PositiveIntegerField(default=60, null=True, blank=True)
    status = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'organizations'
        ordering = ['-created_at']

    def __str__(self):
        return self.name


class SubscriptionPlan(models.Model):
    BILLING_CHOICES = (
        ('monthly', 'Monthly'),
        ('yearly', 'Yearly'),
        ('lifetime', 'Lifetime'),
    )

    name = models.CharField(max_length=100)
    code = models.CharField(max_length=50, unique=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=10, default='USD')
    billing_cycle = models.CharField(max_length=20, choices=BILLING_CHOICES)
    duration_days = models.PositiveIntegerField()
    description = models.TextField(blank=True, null=True)
    features = models.JSONField(default=dict, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'subscription_plans'
        ordering = ['price']

    def __str__(self):
        return self.name


class Subscription(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('active', 'Active'),
        ('expired', 'Expired'),
        ('cancelled', 'Cancelled'),
        ('trial', 'Trial'),
    )

    user = models.ForeignKey(Users, on_delete=models.CASCADE, related_name='subscriptions')
    organization = models.ForeignKey(
        Organization,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='subscriptions',
    )
    plan = models.ForeignKey(SubscriptionPlan, on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    trial_end_date = models.DateTimeField(blank=True, null=True)
    auto_renew = models.BooleanField(default=True)
    cancelled_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'subscriptions'
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.user} - {self.plan.name}'


class SubscriptionPayment(models.Model):
    PAYMENT_STATUS = (
        ('pending', 'Pending'),
        ('success', 'Success'),
        ('failed', 'Failed'),
        ('refunded', 'Refunded'),
    )

    subscription = models.ForeignKey(
        Subscription,
        on_delete=models.CASCADE,
        related_name='payments',
    )
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=10, default='USD')
    payment_gateway = models.CharField(max_length=50, blank=True, null=True)
    payment_method = models.CharField(max_length=50, blank=True, null=True)
    transaction_id = models.CharField(max_length=255, blank=True, null=True)
    status = models.CharField(max_length=20, choices=PAYMENT_STATUS, default='pending')
    gateway_response = models.JSONField(default=dict, blank=True)
    paid_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'subscription_payments'
        ordering = ['-created_at']

    def __str__(self):
        return self.transaction_id or str(self.id)


class CardTemplate(models.Model):
    CATEGORY_CHOICES = (
        ('employee', 'Employee'),
        ('visiting', 'Visiting'),
    )
    ORIENTATION_CHOICES = (
        ('landscape', 'Landscape'),
        ('portrait', 'Portrait'),
    )
    INDUSTRY_CHOICES = (
        ('all', 'All'),
        ('technology', 'Technology'),
        ('marketing', 'Marketing'),
        ('corporate', 'Corporate'),
    )

    external_id = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=150)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    industry = models.CharField(max_length=30, choices=INDUSTRY_CHOICES, default='all')
    orientation = models.CharField(max_length=20, choices=ORIENTATION_CHOICES)
    icon = models.CharField(max_length=10, default='🎴')
    html_content = models.TextField()
    theme_defaults = models.JSONField(default=dict, blank=True)
    is_premium = models.BooleanField(default=False)
    is_published = models.BooleanField(default=True)
    sort_order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'card_templates'
        ordering = ['sort_order', 'name']

    def __str__(self):
        return self.name


class ContactSubmission(models.Model):
    STATUS_CHOICES = (
        ('new', 'New'),
        ('in_progress', 'In Progress'),
        ('closed', 'Closed'),
    )

    name = models.CharField(max_length=150)
    email = models.EmailField()
    message = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='new')
    admin_notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'contact_submissions'
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.name} <{self.email}>'


class BlogPost(models.Model):
    slug = models.SlugField(max_length=200, unique=True)
    title = models.CharField(max_length=255)
    excerpt = models.TextField(blank=True)
    body = models.TextField()
    author_name = models.CharField(max_length=150, default='Identiqo Team')
    category = models.CharField(max_length=50, default='general')
    is_published = models.BooleanField(default=False)
    is_featured = models.BooleanField(default=False)
    published_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'blog_posts'
        ordering = ['-created_at']

    def __str__(self):
        return self.title


class AuditLog(models.Model):
    admin = models.ForeignKey(
        AdminUser,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='audit_logs',
    )
    action = models.CharField(max_length=100)
    entity_type = models.CharField(max_length=50)
    entity_id = models.CharField(max_length=100, blank=True)
    metadata = models.JSONField(default=dict, blank=True)
    ip_address = models.GenericIPAddressField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'audit_logs'
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.action} on {self.entity_type}'


class PlatformSetting(models.Model):
    key = models.CharField(max_length=100, unique=True)
    value = models.JSONField(default=dict)
    description = models.CharField(max_length=255, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'platform_settings'

    def __str__(self):
        return self.key
