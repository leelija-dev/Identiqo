from django.contrib.auth.hashers import make_password
from django.core.management.base import BaseCommand
from admin_api.models import AdminUser, PlatformSetting, SubscriptionPlan


class Command(BaseCommand):
    help = 'Seed super admin user, subscription plans, and default platform settings.'

    def add_arguments(self, parser):
        parser.add_argument('--email', default='admin@identiqo.com')
        parser.add_argument('--password', default='Admin@12345')
        parser.add_argument('--name', default='Super Admin')

    def handle(self, *args, **options):
        email = options['email']
        password = options['password']
        name = options['name']

        admin, created = AdminUser.objects.update_or_create(
            email=email,
            defaults={
                'password': make_password(password),
                'full_name': name,
                'status': True,
            },
        )
        action = 'Created' if created else 'Updated'
        self.stdout.write(self.style.SUCCESS(f'{action} admin: {email}'))

        plans = [
            {
                'code': 'essential',
                'name': 'Essential',
                'price': 29,
                'currency': 'USD',
                'billing_cycle': 'monthly',
                'duration_days': 30,
                'description': 'Up to 60 employee IDs, 12 premium templates.',
                'features': {'max_employee_cards': 60, 'max_templates': 12},
            },
            {
                'code': 'professional',
                'name': 'Professional',
                'price': 79,
                'currency': 'USD',
                'billing_cycle': 'monthly',
                'duration_days': 30,
                'description': 'Unlimited IDs, bulk CSV, API access.',
                'features': {'max_employee_cards': None, 'bulk_csv': True, 'api': True},
            },
            {
                'code': 'enterprise',
                'name': 'Enterprise',
                'price': 0,
                'currency': 'USD',
                'billing_cycle': 'yearly',
                'duration_days': 365,
                'description': 'Custom pricing and dedicated support.',
                'features': {'sso': True, 'audit_logs': True, 'on_prem': True},
            },
        ]

        for data in plans:
            SubscriptionPlan.objects.update_or_create(
                code=data['code'],
                defaults={**data, 'is_active': True},
            )
            self.stdout.write(f'  Plan: {data["code"]}')

        PlatformSetting.objects.update_or_create(
            key='maintenance_mode',
            defaults={
                'value': {'enabled': False},
                'description': 'When enabled, public app shows maintenance message.',
            },
        )

        self.stdout.write(self.style.SUCCESS('Seed complete.'))
        self.stdout.write(f'  Dashboard: http://127.0.0.1:8000/super-admin/login/')
        self.stdout.write(f'  Login: {email} / {password}')
