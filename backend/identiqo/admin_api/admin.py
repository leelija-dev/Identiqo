from django.contrib import admin

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


@admin.register(AdminUser)
class AdminUserAdmin(admin.ModelAdmin):
    list_display = ('email', 'full_name', 'status', 'created_at')
    search_fields = ('email', 'full_name')


@admin.register(Organization)
class OrganizationAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'plan_tier', 'owner', 'status')
    list_filter = ('plan_tier', 'status')
    search_fields = ('name', 'slug')


@admin.register(SubscriptionPlan)
class SubscriptionPlanAdmin(admin.ModelAdmin):
    list_display = ('code', 'name', 'price', 'plan_type', 'is_active')


@admin.register(Subscription)
class SubscriptionAdmin(admin.ModelAdmin):
    list_display = ('user', 'plan', 'status', 'start_date', 'end_date')
    list_filter = ('status',)


@admin.register(SubscriptionPayment)
class SubscriptionPaymentAdmin(admin.ModelAdmin):
    list_display = ('subscription', 'amount', 'status', 'created_at')
    list_filter = ('status',)


@admin.register(CardTemplate)
class CardTemplateAdmin(admin.ModelAdmin):
    list_display = ('external_id', 'name', 'category', 'orientation', 'is_published')
    list_filter = ('category', 'orientation', 'is_published')


@admin.register(ContactSubmission)
class ContactSubmissionAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'status', 'created_at')
    list_filter = ('status',)


@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display = ('title', 'slug', 'is_published', 'is_featured', 'published_at')
    prepopulated_fields = {'slug': ('title',)}


@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = ('action', 'entity_type', 'admin', 'created_at')
    readonly_fields = ('action', 'entity_type', 'entity_id', 'metadata', 'admin', 'ip_address', 'created_at')


@admin.register(PlatformSetting)
class PlatformSettingAdmin(admin.ModelAdmin):
    list_display = ('key', 'description', 'updated_at')
