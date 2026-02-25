import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

create_flag = os.getenv("DJANGO_SUPERUSER_CREATE", "").lower()
if create_flag not in {"1", "true", "yes"}:
    print("Superuser creation skipped (DJANGO_SUPERUSER_CREATE not enabled).")
    raise SystemExit(0)

username = os.getenv("DJANGO_SUPERUSER_USERNAME")
email = os.getenv("DJANGO_SUPERUSER_EMAIL")
password = os.getenv("DJANGO_SUPERUSER_PASSWORD")
force_password = os.getenv("DJANGO_SUPERUSER_FORCE_PASSWORD", "").lower() in {"1", "true", "yes"}

if not username or not email or not password:
    print("Superuser creation skipped (missing DJANGO_SUPERUSER_* env vars).")
    raise SystemExit(0)

user, created = User.objects.get_or_create(username=username, defaults={"email": email})
user.is_staff = True
user.is_superuser = True
user.role = "admin"
if created or force_password:
    user.set_password(password)
user.save()

if created:
    print("Superuser created from env vars.")
else:
    print("Superuser already exists; permissions ensured.")
