# Generated migration for user_type field in SubscriptionPlan

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('admin_api', '0003_super_admin_dashboard_models'),
    ]

    operations = [
        migrations.AddField(
            model_name='subscriptionplan',
            name='user_type',
            field=models.CharField(
                choices=[('individual', 'Individual'), ('organization', 'Organization'), ('both', 'Both')],
                default='both',
                max_length=20
            ),
        ),
    ]
