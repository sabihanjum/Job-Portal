release: python backend/manage.py migrate
web: cd backend && gunicorn config.wsgi:application --bind 0.0.0.0:$PORT
