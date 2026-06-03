# Generated manually for super admin dashboard

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('admin_api', '0002_subscriptionplan_subscription_subscriptionpayment'),
        ('web_api', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Organization',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('slug', models.SlugField(max_length=100, unique=True)),
                ('plan_tier', models.CharField(choices=[('free', 'Free'), ('essential', 'Essential'), ('professional', 'Professional'), ('enterprise', 'Enterprise')], default='free', max_length=20)),
                ('employee_id_limit', models.PositiveIntegerField(blank=True, default=60, null=True)),
                ('status', models.BooleanField(default=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('owner', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='owned_organizations', to='web_api.users')),
            ],
            options={
                'db_table': 'organizations',
                'ordering': ['-created_at'],
            },
        ),
        migrations.AddField(
            model_name='subscription',
            name='organization',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='subscriptions', to='admin_api.organization'),
        ),
        migrations.CreateModel(
            name='CardTemplate',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('external_id', models.CharField(max_length=50, unique=True)),
                ('name', models.CharField(max_length=150)),
                ('category', models.CharField(choices=[('employee', 'Employee'), ('visiting', 'Visiting')], max_length=20)),
                ('industry', models.CharField(choices=[('all', 'All'), ('technology', 'Technology'), ('marketing', 'Marketing'), ('corporate', 'Corporate')], default='all', max_length=30)),
                ('orientation', models.CharField(choices=[('landscape', 'Landscape'), ('portrait', 'Portrait')], max_length=20)),
                ('icon', models.CharField(default='🎴', max_length=10)),
                ('html_content', models.TextField()),
                ('theme_defaults', models.JSONField(blank=True, default=dict)),
                ('is_premium', models.BooleanField(default=False)),
                ('is_published', models.BooleanField(default=True)),
                ('sort_order', models.PositiveIntegerField(default=0)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'db_table': 'card_templates',
                'ordering': ['sort_order', 'name'],
            },
        ),
        migrations.CreateModel(
            name='ContactSubmission',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=150)),
                ('email', models.EmailField(max_length=254)),
                ('message', models.TextField()),
                ('status', models.CharField(choices=[('new', 'New'), ('in_progress', 'In Progress'), ('closed', 'Closed')], default='new', max_length=20)),
                ('admin_notes', models.TextField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'db_table': 'contact_submissions',
                'ordering': ['-created_at'],
            },
        ),
        migrations.CreateModel(
            name='BlogPost',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('slug', models.SlugField(max_length=200, unique=True)),
                ('title', models.CharField(max_length=255)),
                ('excerpt', models.TextField(blank=True)),
                ('body', models.TextField()),
                ('author_name', models.CharField(default='Identiqo Team', max_length=150)),
                ('category', models.CharField(default='general', max_length=50)),
                ('is_published', models.BooleanField(default=False)),
                ('is_featured', models.BooleanField(default=False)),
                ('published_at', models.DateTimeField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'db_table': 'blog_posts',
                'ordering': ['-created_at'],
            },
        ),
        migrations.CreateModel(
            name='AuditLog',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('action', models.CharField(max_length=100)),
                ('entity_type', models.CharField(max_length=50)),
                ('entity_id', models.CharField(blank=True, max_length=100)),
                ('metadata', models.JSONField(blank=True, default=dict)),
                ('ip_address', models.GenericIPAddressField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('admin', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='audit_logs', to='admin_api.adminuser')),
            ],
            options={
                'db_table': 'audit_logs',
                'ordering': ['-created_at'],
            },
        ),
        migrations.CreateModel(
            name='PlatformSetting',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('key', models.CharField(max_length=100, unique=True)),
                ('value', models.JSONField(default=dict)),
                ('description', models.CharField(blank=True, max_length=255)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'db_table': 'platform_settings',
            },
        ),
        migrations.AlterModelTable(
            name='subscriptionplan',
            table='subscription_plans',
        ),
        migrations.AlterModelTable(
            name='subscription',
            table='subscriptions',
        ),
        migrations.AlterModelTable(
            name='subscriptionpayment',
            table='subscription_payments',
        ),
    ]
