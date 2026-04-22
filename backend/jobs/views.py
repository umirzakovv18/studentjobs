from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404

from .models import Company, Job, Application, StudentProfile
from .serializers import (
    LoginSerializer, ApplicationStatusSerializer,
    CompanySerializer, JobSerializer, ApplicationSerializer, StudentProfileSerializer,
    UserSerializer,
)


# ─── FBV #1 — Login ───────────────────────────────────────────────────────────
@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    serializer = LoginSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    user = authenticate(
        username=serializer.validated_data['username'],
        password=serializer.validated_data['password'],
    )
    if not user:
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

    token, _ = Token.objects.get_or_create(user=user)
    return Response({
        'token': token.key,
        'user': UserSerializer(user).data,
    })


# ─── FBV #2 — Logout ──────────────────────────────────────────────────────────
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    request.user.auth_token.delete()
    return Response({'message': 'Logged out successfully'})


# ─── FBV #3 — Register ────────────────────────────────────────────────────────
@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    username = request.data.get('username')
    password = request.data.get('password')
    email    = request.data.get('email', '')

    if not username or not password:
        return Response({'error': 'Username and password required'}, status=400)
    if User.objects.filter(username=username).exists():
        return Response({'error': 'Username already taken'}, status=400)

    user = User.objects.create_user(username=username, password=password, email=email)
    StudentProfile.objects.create(user=user)   # auto-create profile
    token, _ = Token.objects.get_or_create(user=user)
    return Response({'token': token.key, 'user': UserSerializer(user).data}, status=201)


# ─── CBV #1 — Job List + Create ───────────────────────────────────────────────
class JobListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        jobs = Job.active.all().order_by('-created_at')

        # Filter by job_type query param
        job_type = request.query_params.get('job_type')
        if job_type:
            jobs = jobs.filter(job_type=job_type)

        serializer = JobSerializer(jobs, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = JobSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(created_by=request.user)   # link to auth user
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


# ─── CBV #2 — Job Detail (CRUD) ───────────────────────────────────────────────
class JobDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, pk):
        return get_object_or_404(Job, pk=pk)

    def get(self, request, pk):
        job = self.get_object(pk)
        return Response(JobSerializer(job).data)

    def put(self, request, pk):
        job = self.get_object(pk)
        if job.created_by != request.user:
            return Response({'error': 'Forbidden'}, status=403)
        serializer = JobSerializer(job, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    def delete(self, request, pk):
        job = self.get_object(pk)
        if job.created_by != request.user:
            return Response({'error': 'Forbidden'}, status=403)
        job.delete()
        return Response(status=204)


# ─── CBV #3 — Application List + Create ──────────────────────────────────────
class ApplicationListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        apps = Application.objects.filter(applicant=request.user).order_by('-applied_at')
        return Response(ApplicationSerializer(apps, many=True).data)

    def post(self, request):
        serializer = ApplicationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(applicant=request.user)   # link to auth user
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


# ─── CBV #4 — Update Application Status (employer) ───────────────────────────
class ApplicationStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        app = get_object_or_404(Application, pk=pk)
        serializer = ApplicationStatusSerializer(data=request.data)
        if serializer.is_valid():
            app.status = serializer.validated_data['status']
            app.save()
            return Response(ApplicationSerializer(app).data)
        return Response(serializer.errors, status=400)


# ─── CBV #5 — Company CRUD ────────────────────────────────────────────────────
class CompanyListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        companies = Company.objects.all()
        return Response(CompanySerializer(companies, many=True).data)

    def post(self, request):
        serializer = CompanySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(owner=request.user)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


# ─── CBV #6 — Student Profile ────────────────────────────────────────────────
class StudentProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile, _ = StudentProfile.objects.get_or_create(user=request.user)
        return Response(StudentProfileSerializer(profile).data)

    def put(self, request):
        profile, _ = StudentProfile.objects.get_or_create(user=request.user)
        serializer = StudentProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
