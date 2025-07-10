# users/serializers.py
from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from .models import CustomUser, KYC, Group, Message, Task, TaskApplication, LearningTrack, Lesson

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ['username', 'password']

    def create(self, validated_data):
        # Hash the password before saving
        validated_data['password'] = make_password(validated_data['password'])
        return super().create(validated_data)


class KYCSerializer(serializers.ModelSerializer):
    class Meta:
        model = KYC
        exclude = ['id', 'submitted_at', 'user']  # user will be set from request

    def create(self, validated_data):
        user = self.context['request'].user
        if hasattr(user, 'kyc'):
            raise serializers.ValidationError("KYC already submitted.")
        return KYC.objects.create(user=user, **validated_data)

class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ['id', 'name', 'description', 'created_at']

class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['id', 'group', 'sender', 'content', 'timestamp']
        read_only_fields = ['sender', 'timestamp']

    def create(self, validated_data):
        user = self.context['request'].user
        return Message.objects.create(sender=user, **validated_data)

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'bio', 'profile_picture', 'care_points']
        read_only_fields = ['id', 'username', 'email', 'care_points']
class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'

class TaskApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskApplication
        fields = '__all__'

class LearningTrackSerializer(serializers.ModelSerializer):
    class Meta:
        model = LearningTrack
        fields = ['id', 'title', 'category', 'description']

class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = ['id', 'title', 'video_url', 'thumbnail_url', 'tags']