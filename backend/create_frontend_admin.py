import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.authentication.models import User

# Create admin user for frontend
username = 'admin'
email = 'admin@jobportal.com'
password = 'admin123'
role = 'admin'

try:
    # Check if user exists
    if User.objects.filter(username=username).exists():
        user = User.objects.get(username=username)
        user.email = email
        user.role = role
        user.is_staff = True
        user.is_superuser = True
        user.set_password(password)
        user.save()
        print(f"✓ Admin user '{username}' updated successfully!")
    else:
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            role=role,
            is_staff=True,
            is_superuser=True
        )
        print(f"✓ Admin user '{username}' created successfully!")
    
    print("\n" + "="*60)
    print("FRONTEND LOGIN CREDENTIALS (Admin)")
    print("="*60)
    print(f"Frontend URL:  http://localhost:3000/login")
    print(f"Username:      {username}")
    print(f"Password:      {password}")
    print(f"Role:          {role}")
    print("="*60)
    print("\nDjango Admin URL: http://127.0.0.1:8000/admin/")
    print("Same credentials work for Django admin too!")
    print("="*60)

except Exception as e:
    print(f"Error: {e}")
