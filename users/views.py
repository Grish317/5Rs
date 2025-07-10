from django.shortcuts import render

# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from .serializers import RegisterSerializer, KYCSerializer, GroupSerializer, MessageSerializer, UserProfileSerializer, TaskSerializer, TaskApplicationSerializer, LearningTrackSerializer, LessonSerializer
from rest_framework.permissions import IsAuthenticated
from .permissions import IsKYCVerified  # <-- import your custom permission here
from .models import KYC, Group, Message, Task, TaskApplication, LearningTrack, Lesson, LearningLog
from rest_framework import generics, permissions
from rest_framework.decorators import api_view, permission_classes


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'User created successfully'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            return Response({'message': 'Username and password required'}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(username=username, password=password)
        if not user:
            return Response({'message': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

        token, _ = Token.objects.get_or_create(user=user)
        return Response({'token': token.key})


class KYCUploadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = KYCSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response({'message': '✅ KYC submitted successfully!'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class SomeProtectedView(APIView):
    permission_classes = [IsAuthenticated, IsKYCVerified]

    def get(self, request):
        return Response({"message": "Access granted, KYC verified!"})

class KYCStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            kyc = KYC.objects.get(user=request.user)
            return Response({
                "status": kyc.status,
                "verified_at": kyc.verified_at,
                "verified_by": kyc.verified_by.username if kyc.verified_by else None
            })
        except KYC.DoesNotExist:
            return Response({"status": "not_submitted"})


class GroupListAPIView(generics.ListAPIView):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [permissions.IsAuthenticated]  # Require login

class MessageCreateAPIView(generics.CreateAPIView):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(sender=self.request.user)


class GroupMessagesAPIView(generics.ListAPIView):
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        group_id = self.kwargs['group_id']
        return Message.objects.filter(group_id=group_id).order_by('timestamp')


class CreateMessageAPIView(generics.CreateAPIView):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_context(self):
        return {"request": self.request}


@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def user_profile(request):
    user = request.user

    if request.method == 'GET':
        serializer = UserProfileSerializer(user)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = UserProfileSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

# GET /tasks
class TaskListView(generics.ListAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [permissions.AllowAny]  # Or IsAuthenticated

# POST /apply-task
class ApplyTaskView(generics.CreateAPIView):
    serializer_class = TaskApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_learning_tracks(request):
    tracks = LearningTrack.objects.all()
    serializer = LearningTrackSerializer(tracks, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_lessons_by_track(request, track_id):
    lessons = Lesson.objects.filter(track_id=track_id)
    completed_lessons = LearningLog.objects.filter(user=request.user).values_list('lesson_id', flat=True)

    data = []
    for lesson in lessons:
        serialized = LessonSerializer(lesson).data
        serialized['completed'] = lesson.id in completed_lessons
        data.append(serialized)

    return Response(data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def log_lesson(request):
    lesson_id = request.data.get('lesson_id')
    try:
        lesson = Lesson.objects.get(id=lesson_id)
    except Lesson.DoesNotExist:
        return Response({"error": "Lesson not found"}, status=404)

    log, created = LearningLog.objects.get_or_create(user=request.user, lesson=lesson)
    if created:
        return Response({"message": "Lesson logged!"})
    return Response({"message": "Lesson was already logged."})
