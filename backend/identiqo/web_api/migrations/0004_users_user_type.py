# Generated migration for user_type field

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('web_api', '0003_users_groups_users_is_active_users_is_superuser_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='users',
            name='user_type',
            field=models.CharField(
                choices=[('individual', 'Individual'), ('organization', 'Organization')],
                default='individual',
                max_length=20
            ),
        ),
    ]
