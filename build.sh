#!/bin/bash
set -o errexit

echo "Upgrading pip..."
pip install --upgrade pip

echo "Installing backend dependencies..."
pip install --no-cache-dir -r backend/requirements.txt

echo "Downloading spaCy model..."
python -m spacy download en_core_web_sm

echo "Installing frontend dependencies..."
cd frontend
npm install
echo "Building frontend..."
npm run build
cd ..

echo "Collecting static files..."
cd backend
python manage.py collectstatic --noinput
cd ..

echo "Running database migrations..."
cd backend
python manage.py migrate
cd ..

echo "Creating superuser (if configured)..."
cd backend
python create_superuser_from_env.py
cd ..

echo "Creating sample jobs (if env var enabled)..."
if [ "$CREATE_SAMPLE_DATA" = "true" ]; then
  cd backend
  python create_sample_jobs.py
  cd ..
else
  echo "Skipping sample data creation (set CREATE_SAMPLE_DATA=true to enable)"
fi

echo "Build completed successfully!"
