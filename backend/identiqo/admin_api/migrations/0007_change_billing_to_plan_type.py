# Generated migration to change billing_cycle to plan_type

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('admin_api', '0006_merge_20260626_1739'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='subscriptionplan',
            name='billing_cycle',
        ),
        migrations.RemoveField(
            model_name='subscriptionplan',
            name='user_type',
        ),
        migrations.AddField(
            model_name='subscriptionplan',
            name='plan_type',
            field=models.CharField(
                choices=[('personal', 'Personal'), ('business', 'Business')],
                default='personal',
                max_length=20
            ),
        ),
    ]
