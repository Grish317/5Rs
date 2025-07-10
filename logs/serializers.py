from rest_framework import serializers
from .models import Badge, UserBadge
from .models import Log

class LogSerializer(serializers.ModelSerializer):
    class Meta:
        model = Log
        fields = ['id', 'description', 'created_at']

class UserBadgeSerializer(serializers.ModelSerializer):
    badge = serializers.StringRelatedField()

    class Meta:
        model = UserBadge
        fields = ['badge', 'awarded_at']
