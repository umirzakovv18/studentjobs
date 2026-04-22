from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Company, Job, Application, StudentProfile


# ─── serializers.Serializer (plain) ──────────────────────────────────────────

class LoginSerializer(serializers.Serializer):
    """Plain serializer #1 — used for login endpoint."""
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)


class ApplicationStatusSerializer(serializers.Serializer):
    """Plain serializer #2 — used to update application status."""
    status = serializers.ChoiceField(choices=['pending', 'reviewed', 'accepted', 'rejected'])


# ─── serializers.ModelSerializer ─────────────────────────────────────────────

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model  = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']


class StudentProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model  = StudentProfile
        fields = ['id', 'user', 'university', 'major', 'grad_year', 'bio', 'resume_url']


class CompanySerializer(serializers.ModelSerializer):
    owner_username = serializers.ReadOnlyField(source='owner.username')

    class Meta:
        model  = Company
        fields = ['id', 'name', 'description', 'website', 'owner', 'owner_username', 'created_at']
        read_only_fields = ['owner']


class JobSerializer(serializers.ModelSerializer):
    company_name    = serializers.ReadOnlyField(source='company.name')
    created_by_name = serializers.ReadOnlyField(source='created_by.username')

    class Meta:
        model  = Job
        fields = [
            'id', 'title', 'description', 'job_type', 'salary',
            'location', 'is_active', 'company', 'company_name',
            'created_by', 'created_by_name', 'created_at',
        ]
        read_only_fields = ['created_by']


class ApplicationSerializer(serializers.ModelSerializer):
    applicant_name = serializers.ReadOnlyField(source='applicant.username')
    job_title      = serializers.ReadOnlyField(source='job.title')

    class Meta:
        model  = Application
        fields = ['id', 'job', 'job_title', 'applicant', 'applicant_name',
                  'cover_letter', 'status', 'applied_at']
        read_only_fields = ['applicant', 'status']
