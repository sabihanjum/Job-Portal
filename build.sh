#!/bin/bash
set -o errexit

echo "Installing backend dependencies..."
pip install -r backend/requirements.txt

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

echo "Build completed successfully!"
