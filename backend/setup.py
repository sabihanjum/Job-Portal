#!/usr/bin/env python
"""
Setup script for AI Job Portal Backend
Run this after installing requirements to download AI models
"""

import subprocess
import sys

def download_spacy_model():
    """Download spaCy English model"""
    print("Downloading spaCy English model...")
    try:
        subprocess.check_call([sys.executable, "-m", "spacy", "download", "en_core_web_sm"])
        print("✓ spaCy model downloaded successfully")
    except Exception as e:
        print(f"✗ Failed to download spaCy model: {e}")

def main():
    print("=" * 50)
    print("AI Job Portal - Backend Setup")
    print("=" * 50)
    
    download_spacy_model()
    
    print("\n" + "=" * 50)
    print("Setup complete!")
    print("=" * 50)
    print("\nNext steps:")
    print("1. Configure MySQL database")
    print("2. Copy .env.example to .env and update settings")
    print("3. Run: python manage.py migrate")
    print("4. Run: python manage.py createsuperuser")
    print("5. Run: python manage.py runserver")

if __name__ == "__main__":
    main()
