# Identiqo Backend

Django REST API + **Super Admin Dashboard** (server-rendered UI).

## Quick start

```bash
cd backend/identiqo
python -m venv venv
venv\Scripts\activate          # Windows
pip install -r requirements.txt

copy .env.example .env
# Edit .env — SQLite is default; set USE_POSTGRES=true for PostgreSQL

python manage.py migrate
python manage.py seed_super_admin
python manage.py runserver
```

Open **Super Admin Dashboard:** [http://127.0.0.1:8000/super-admin/login/](http://127.0.0.1:8000/super-admin/login/)

Default credentials (after seed):

| Field | Value |
|-------|--------|
| Email | `admin@identiqo.com` |
| Password | `Admin@12345` |

Custom admin:

```bash
python manage.py seed_super_admin --email you@company.com --password YourSecurePass
```

## URLs

| Path | Description |
|------|-------------|
| `/super-admin/` | Dashboard home (requires login) |
| `/super-admin/login/` | Admin login |
| `/admin-api/register/` | REST admin registration |
| `/admin-api/login/` | REST admin login (JSON) |
| `/admin/` | Django built-in admin |

## Dashboard modules

- **Dashboard** — stats, recent users, contact inbox, audit trail
- **Customers** — CRUD for `web_api.Users`
- **Organizations** — workspaces, plan tier, limits
- **Templates** — card template catalog (HTML storage)
- **Plans / Subscriptions / Payments** — billing management
- **Contact** — support inbox with status notes
- **Blog** — CMS for articles
- **Audit logs** — admin action history
- **Admins** — super admin user accounts
- **Settings** — platform flags + maintenance mode toggle

## PostgreSQL (optional)

When PostgreSQL is installed and running:

```powershell
$env:USE_POSTGRES="true"
$env:DB_NAME="identiqo_db"
$env:DB_USER="postgres"
$env:DB_PASSWORD="your_password"
python manage.py migrate
```

## Project layout

```
backend/identiqo/
  admin_api/           # Admin models, REST auth, super admin UI
    dashboard_views.py
    dashboard_urls.py
    templates/super_admin/
    static/super_admin/
  web_api/             # Customer user model
  identiqo/            # Django settings
```
