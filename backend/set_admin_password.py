import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.authentication.models import User

admin = User.objects.get(username='admin')
admin.set_password('admin123')
admin.role = 'admin'
admin.save()
print("Admin password set to: admin123")
