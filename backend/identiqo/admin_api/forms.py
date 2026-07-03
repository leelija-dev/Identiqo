import json

from django import forms
from django.contrib.auth.hashers import make_password

from web_api.models import Users

from .models import (
    AdminUser,
    BlogPost,
    CardTemplate,
    ContactSubmission,
    Organization,
    PlatformSetting,
    SubscriptionPlan,
)


class AdminLoginForm(forms.Form):
    email = forms.EmailField(widget=forms.EmailInput(attrs={'class': 'form-input', 'placeholder': 'admin@identiqo.com'}))
    password = forms.CharField(widget=forms.PasswordInput(attrs={'class': 'form-input', 'placeholder': '••••••••'}))


class UserForm(forms.ModelForm):
    password = forms.CharField(
        required=False,
        widget=forms.PasswordInput(attrs={'class': 'form-input'}),
        help_text='Leave blank to keep current password when editing.',
    )

    class Meta:
        model = Users
        fields = ['name', 'email', 'phone', 'address', 'password']
        widgets = {
            'name': forms.TextInput(attrs={'class': 'form-input'}),
            'email': forms.EmailInput(attrs={'class': 'form-input'}),
            'phone': forms.TextInput(attrs={'class': 'form-input'}),
            'address': forms.Textarea(attrs={'class': 'form-input', 'rows': 3}),
        }

    def clean(self):
        cleaned = super().clean()
        if not self.instance.pk and not cleaned.get('password'):
            raise forms.ValidationError('Password is required for new users.')
        return cleaned

    def save(self, commit=True):
        user = super().save(commit=False)
        raw = self.cleaned_data.get('password')
        if raw:
            user.password = make_password(raw)
        elif not user.pk:
            user.password = make_password('changeme123')
        if commit:
            user.save()
        return user


class OrganizationForm(forms.ModelForm):
    class Meta:
        model = Organization
        fields = ['name', 'slug', 'owner', 'plan_tier', 'employee_id_limit', 'status']
        widgets = {
            'name': forms.TextInput(attrs={'class': 'form-input'}),
            'slug': forms.TextInput(attrs={'class': 'form-input'}),
            'owner': forms.Select(attrs={'class': 'form-input'}),
            'plan_tier': forms.Select(attrs={'class': 'form-input'}),
            'employee_id_limit': forms.NumberInput(attrs={'class': 'form-input'}),
            'status': forms.CheckboxInput(attrs={'class': 'form-checkbox'}),
        }


def _parse_json_field(value, field_name):
    if not value or not str(value).strip():
        return {}
    if isinstance(value, dict):
        return value
    try:
        return json.loads(value)
    except json.JSONDecodeError as exc:
        raise forms.ValidationError(f'{field_name} must be valid JSON.') from exc


class SubscriptionPlanForm(forms.ModelForm):
    features = forms.CharField(
        required=False,
        widget=forms.HiddenInput(),
    )

    class Meta:
        model = SubscriptionPlan
        fields = [
            'name', 'code', 'plan_type', 'price', 'currency', 'duration_days',
            'description', 'features', 'is_active',
        ]
        widgets = {
            'name': forms.TextInput(attrs={'class': 'form-input'}),
            'code': forms.TextInput(attrs={'class': 'form-input'}),
            'plan_type': forms.Select(attrs={'class': 'form-input'}),
            'price': forms.NumberInput(attrs={'class': 'form-input', 'step': '0.01'}),
            'currency': forms.TextInput(attrs={'class': 'form-input'}),
            'duration_days': forms.NumberInput(attrs={'class': 'form-input'}),
            'description': forms.Textarea(attrs={'class': 'form-input', 'rows': 3}),
            'is_active': forms.CheckboxInput(attrs={'class': 'form-checkbox'}),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if self.instance and self.instance.pk and self.instance.features:
            self.fields['features'].initial = json.dumps(self.instance.features)

    def clean_features(self):
        return _parse_json_field(self.cleaned_data.get('features'), 'Features')


class CardTemplateForm(forms.ModelForm):
    theme_defaults = forms.CharField(
        required=False,
        widget=forms.Textarea(attrs={'class': 'form-input', 'rows': 3}),
    )

    class Meta:
        model = CardTemplate
        fields = [
            'external_id', 'name', 'category', 'industry', 'orientation',
            'icon', 'html_content', 'theme_defaults', 'is_premium',
            'is_published', 'sort_order',
        ]
        widgets = {
            'external_id': forms.TextInput(attrs={'class': 'form-input'}),
            'name': forms.TextInput(attrs={'class': 'form-input'}),
            'category': forms.Select(attrs={'class': 'form-input'}),
            'industry': forms.Select(attrs={'class': 'form-input'}),
            'orientation': forms.Select(attrs={'class': 'form-input'}),
            'icon': forms.TextInput(attrs={'class': 'form-input'}),
            'html_content': forms.Textarea(attrs={'class': 'form-input font-mono text-xs', 'rows': 12}),
            'is_premium': forms.CheckboxInput(attrs={'class': 'form-checkbox'}),
            'is_published': forms.CheckboxInput(attrs={'class': 'form-checkbox'}),
            'sort_order': forms.NumberInput(attrs={'class': 'form-input'}),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if self.instance and self.instance.pk and self.instance.theme_defaults:
            self.fields['theme_defaults'].initial = json.dumps(self.instance.theme_defaults, indent=2)

    def clean_theme_defaults(self):
        return _parse_json_field(self.cleaned_data.get('theme_defaults'), 'Theme defaults')


class ContactSubmissionForm(forms.ModelForm):
    class Meta:
        model = ContactSubmission
        fields = ['status', 'admin_notes']
        widgets = {
            'status': forms.Select(attrs={'class': 'form-input'}),
            'admin_notes': forms.Textarea(attrs={'class': 'form-input', 'rows': 4}),
        }


class BlogPostForm(forms.ModelForm):
    class Meta:
        model = BlogPost
        fields = [
            'slug', 'title', 'excerpt', 'body', 'author_name',
            'category', 'is_published', 'is_featured', 'published_at',
        ]
        widgets = {
            'slug': forms.TextInput(attrs={'class': 'form-input'}),
            'title': forms.TextInput(attrs={'class': 'form-input'}),
            'excerpt': forms.Textarea(attrs={'class': 'form-input', 'rows': 2}),
            'body': forms.Textarea(attrs={'class': 'form-input', 'rows': 10}),
            'author_name': forms.TextInput(attrs={'class': 'form-input'}),
            'category': forms.TextInput(attrs={'class': 'form-input'}),
            'is_published': forms.CheckboxInput(attrs={'class': 'form-checkbox'}),
            'is_featured': forms.CheckboxInput(attrs={'class': 'form-checkbox'}),
            'published_at': forms.DateTimeInput(attrs={'class': 'form-input', 'type': 'datetime-local'}),
        }


class PlatformSettingForm(forms.ModelForm):
    value = forms.CharField(
        widget=forms.Textarea(attrs={'class': 'form-input', 'rows': 4}),
    )

    class Meta:
        model = PlatformSetting
        fields = ['key', 'value', 'description']
        widgets = {
            'key': forms.TextInput(attrs={'class': 'form-input'}),
            'description': forms.TextInput(attrs={'class': 'form-input'}),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if self.instance and self.instance.pk and self.instance.value is not None:
            self.fields['value'].initial = json.dumps(self.instance.value, indent=2)

    def clean_value(self):
        return _parse_json_field(self.cleaned_data.get('value'), 'Value')


class AdminUserForm(forms.ModelForm):
    password = forms.CharField(
        required=False,
        widget=forms.PasswordInput(attrs={'class': 'form-input'}),
    )

    class Meta:
        model = AdminUser
        fields = ['email', 'full_name', 'phone', 'status', 'password']
        widgets = {
            'email': forms.EmailInput(attrs={'class': 'form-input'}),
            'full_name': forms.TextInput(attrs={'class': 'form-input'}),
            'phone': forms.TextInput(attrs={'class': 'form-input'}),
            'status': forms.CheckboxInput(attrs={'class': 'form-checkbox'}),
        }

    def save(self, commit=True):
        admin = super().save(commit=False)
        raw = self.cleaned_data.get('password')
        if raw:
            admin.password = make_password(raw)
        if commit:
            admin.save()
        return admin
