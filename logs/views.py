from django.shortcuts import render

# Create your views here.
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from .models import Log, UserBadge
from .serializers import LogSerializer, UserBadgeSerializer

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def log_task(request):
    serializer = LogSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(user=request.user)
        # Badge-awarding logic
        log_count = Log.objects.filter(user=request.user).count()
        earned_badges = UserBadge.objects.filter(user=request.user).values_list('badge_id', flat=True)

        # Check eligible badges
        eligible = Badge.objects.filter(awarded_after__lte=log_count).exclude(id__in=earned_badges)

        for badge in eligible:
            UserBadge.objects.create(user=request.user, badge=badge)

        return Response({"message": "Log saved and badge(s) awarded if applicable."})
    return Response(serializer.errors, status=400)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_my_logs(request):
    logs = Log.objects.filter(user=request.user).order_by('-created_at')
    badges = UserBadge.objects.filter(user=request.user)

    logs_data = LogSerializer(logs, many=True).data
    badges_data = UserBadgeSerializer(badges, many=True).data

    return Response({
        "logs": logs_data,
        "badges": badges_data
    })