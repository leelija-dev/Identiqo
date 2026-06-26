from decimal import Decimal

from django.core.management.base import BaseCommand

from admin_api.models import SubscriptionPlan

DEFAULT_PLANS = [
    {
        'name': 'Essential',
        'code': 'essential',
        'price': Decimal('29.00'),
        'currency': 'USD',
        'billing_cycle': 'monthly',
        'duration_days': 30,
        'description': 'billed monthly · cancel anytime',
        'features': {
            'items': [
                'Up to 60 employee IDs',
                '12 premium holographic templates',
                '3D card preview & QR codes',
                'Digital & print ready',
                'Email support (48h)',
                'Basic analytics',
            ],
            'yearly_price': 278,
            'note_yearly': 'billed yearly · 2 months free',
        },
    },
    {
        'name': 'Professional',
        'code': 'professional',
        'price': Decimal('79.00'),
        'currency': 'USD',
        'billing_cycle': 'monthly',
        'duration_days': 30,
        'description': 'billed monthly · save with yearly',
        'features': {
            'items': [
                'Unlimited employee IDs',
                '40+ holographic & AR templates',
                'Custom 3D card builder',
                'Bulk CSV + REST API / webhooks',
                '24/7 priority support',
                'White-label & SSO ready',
                'Real-time sync',
            ],
            'yearly_price': 758,
            'note_yearly': 'billed yearly · save 20% instantly',
        },
    },
    {
        'name': 'Enterprise',
        'code': 'enterprise',
        'price': Decimal('0.00'),
        'currency': 'USD',
        'billing_cycle': 'lifetime',
        'duration_days': 365,
        'description': 'tailored for 1k+ employees',
        'features': {
            'items': [
                'Unlimited IDs + advanced security',
                'On-prem / hybrid deployment',
                'Biometric & NFC integration',
                'Dedicated solution architect',
                '99.99% SLA + 24/7 VIP support',
                'Custom compliance & audit logs',
                'SAML / OIDC / SCIM',
            ],
            'note_yearly': 'dedicated infrastructure',
        },
    },
]


class Command(BaseCommand):
    help = 'Seed default subscription plans for the public pricing page'

    def add_arguments(self, parser):
        parser.add_argument(
            '--force',
            action='store_true',
            help='Update existing plans that match by code',
        )

    def handle(self, *args, **options):
        created = 0
        updated = 0

        for plan_data in DEFAULT_PLANS:
            code = plan_data['code']
            defaults = {k: v for k, v in plan_data.items() if k != 'code'}
            obj, was_created = SubscriptionPlan.objects.update_or_create(
                code=code,
                defaults=defaults,
            )
            if was_created:
                created += 1
                self.stdout.write(self.style.SUCCESS(f'Created plan: {obj.name}'))
            elif options['force']:
                for key, value in defaults.items():
                    setattr(obj, key, value)
                obj.save()
                updated += 1
                self.stdout.write(self.style.WARNING(f'Updated plan: {obj.name}'))
            else:
                self.stdout.write(f'Skipped existing plan: {obj.name}')

        self.stdout.write(
            self.style.SUCCESS(f'Done. created={created}, updated={updated}')
        )
