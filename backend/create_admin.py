import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.authentication.models import User

# Create superuser admin
username = 'admin'
email = 'admin@jobportal.com'
password = 'admin123'

if User.objects.filter(username=username).exists():
    print(f"Admin user '{username}' already exists!")
    admin = User.objects.get(username=username)
    admin.set_password(password)
    admin.is_superuser = True
    admin.is_staff = True
    admin.save()
    print(f"Password reset for admin user")
else:
    admin = User.objects.create_superuser(
        username=username,
        email=email,
        password=password,
        role='admin'
    )
    print(f"Superuser '{username}' created successfully!")

print("\n" + "="*50)
print("Admin Login Credentials:")
print("="*50)
print(f"URL:      http://127.0.0.1:8000/admin/")
print(f"Username: {username}")
print(f"Password: {password}")
print("="*50)
