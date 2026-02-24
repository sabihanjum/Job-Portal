#!/usr/bin/env python
import os
import sys
import django

# Configure Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

if not User.objects.filter(username='admin').exists():
    user = User.objects.create_superuser(
        username='admin',
        email='admin@jobportal.com',
        password='admin123'
    )
    user.role = 'ADMIN'
    user.save()
    print('✓ Superuser created successfully!')
    print('  Username: admin')
    print('  Password: admin123')
    print('  Email: admin@jobportal.com')
else:
    print('✓ Superuser already exists')
