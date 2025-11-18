from rest_framework import serializers
from .models import Resume, ResumeCorrection

class ResumeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resume
        fields = ['id', 'file', 'file_type', 'parsed_data', 'name', 'email', 'phone', 
                  'is_processed', 'processing_error', 'created_at', 'updated_at']
        read_only_fields = ['id', 'parsed_data', 'is_processed', 'processing_error', 
                            'created_at', 'updated_at', 'name', 'email', 'phone']

class ResumeCorrectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResumeCorrection
        fields = ['id', 'resume', 'field_name', 'old_value', 'new_value', 'created_at']
        read_only_fields = ['id', 'created_at', 'corrected_by']
