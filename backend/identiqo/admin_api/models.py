from django.db import models


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
        return self.username

# class SubscriptionPlan(models.Model):

#     BILLING_CHOICES = (
#         ('monthly', 'Monthly'),
#         ('yearly', 'Yearly'),
#         ('lifetime', 'Lifetime'),
#     )

#     name = models.CharField(max_length=100)
#     code = models.CharField(max_length=50, unique=True)

#     price = models.DecimalField(max_digits=10, decimal_places=2)
#     currency = models.CharField(max_length=10, default='INR')

#     billing_cycle = models.CharField(
#         max_length=20,
#         choices=BILLING_CHOICES
#     )

#     duration_days = models.PositiveIntegerField()

#     description = models.TextField(blank=True, null=True)

#     features = models.JSONField(default=dict, blank=True)

#     is_active = models.BooleanField(default=True)

#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)

#     def __str__(self):
#         return self.name


# class Subscription(models.Model):

#     STATUS_CHOICES = (
#         ('pending', 'Pending'),
#         ('active', 'Active'),
#         ('expired', 'Expired'),
#         ('cancelled', 'Cancelled'),
#         ('trial', 'Trial'),
#     )

#     user = models.ForeignKey(
#         User,
#         on_delete=models.CASCADE,
#         related_name='subscriptions'
#     )

#     plan = models.ForeignKey(
#         SubscriptionPlan,
#         on_delete=models.CASCADE
#     )

#     status = models.CharField(
#         max_length=20,
#         choices=STATUS_CHOICES,
#         default='pending'
#     )

#     start_date = models.DateTimeField()
#     end_date = models.DateTimeField()

#     trial_end_date = models.DateTimeField(
#         blank=True,
#         null=True
#     )

#     auto_renew = models.BooleanField(default=True)

#     cancelled_at = models.DateTimeField(
#         blank=True,
#         null=True
#     )

#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)

#     def __str__(self):
#         return f"{self.user.username} - {self.plan.name}"


# class SubscriptionPayment(models.Model):

#     PAYMENT_STATUS = (
#         ('pending', 'Pending'),
#         ('success', 'Success'),
#         ('failed', 'Failed'),
#         ('refunded', 'Refunded'),
#     )

#     subscription = models.ForeignKey(
#         Subscription,
#         on_delete=models.CASCADE,
#         related_name='payments'
#     )

#     amount = models.DecimalField(
#         max_digits=10,
#         decimal_places=2
#     )

#     currency = models.CharField(max_length=10, default='INR')

#     payment_gateway = models.CharField(
#         max_length=50,
#         blank=True,
#         null=True
#     )

#     payment_method = models.CharField(
#         max_length=50,
#         blank=True,
#         null=True
#     )

#     transaction_id = models.CharField(
#         max_length=255,
#         blank=True,
#         null=True
#     )

#     status = models.CharField(
#         max_length=20,
#         choices=PAYMENT_STATUS,
#         default='pending'
#     )

#     gateway_response = models.JSONField(
#         default=dict,
#         blank=True
#     )

#     paid_at = models.DateTimeField(
#         blank=True,
#         null=True
#     )

#     created_at = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return self.transaction_id or str(self.id)