# users/models.py
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings


class CustomUser(AbstractUser):
    kyc_verified = models.BooleanField(default=False)
    is_verified = models.BooleanField(default=False)
    is_ngo = models.BooleanField(default=False)

    # ✅ Add these new fields here
    bio = models.TextField(blank=True)
    profile_picture = models.ImageField(upload_to="profiles/", blank=True, null=True)
    care_points = models.IntegerField(default=0)

    def __str__(self):
        return self.username

# users/models.py (continued) for kyc


class KYC(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    full_name = models.CharField(max_length=255)
    dob = models.DateField()
    address = models.TextField()
    gender = models.CharField(max_length=20)
    phone = models.CharField(max_length=15)
    email = models.EmailField()
    citizen_id = models.CharField(max_length=50)
    status = models.CharField(
        max_length=10,
        choices=[('pending', 'Pending'), ('approved', 'Approved'), ('rejected', 'Rejected')],
        default='pending',
    )
    verified_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True, blank=True,
        on_delete=models.SET_NULL,
        related_name='verified_kycs'
    )
    verified_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"KYC of {self.user.username} - {self.status}"


class Group(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    members = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name="chat_groups")

    def __str__(self):
        return self.name


class Message(models.Model):
    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name="messages")
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        # Just the first 20 chars of the message to keep it tidy
        return f"[{self.timestamp}] {self.sender.username}: {self.content[:20]}"

class Task(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    points = models.IntegerField(default=0)
    posted_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='posted_tasks')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class TaskApplication(models.Model):
    task = models.ForeignKey(Task, on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    applied_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('task', 'user')

class LearningTrack(models.Model):
    CATEGORY_CHOICES = [
        ('life', 'Life Skills'),
        ('income', 'Income Skills'),
    ]

    title = models.CharField(max_length=255)
    category = models.CharField(max_length=10, choices=CATEGORY_CHOICES)
    description = models.TextField(blank=True)

    def __str__(self):
        return f"{self.title} ({self.category})"


class Lesson(models.Model):
    track = models.ForeignKey(LearningTrack, on_delete=models.CASCADE, related_name='lessons')
    title = models.CharField(max_length=255)
    video_url = models.URLField()
    thumbnail_url = models.URLField(blank=True)
    youtube_id = models.CharField(max_length=50)
    tags = models.CharField(max_length=255, help_text="Comma-separated tags")

    def __str__(self):
        return self.title


class LearningLog(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='learning_logs')
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE)
    completed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'lesson')

    def __str__(self):
        return f"{self.user.username} - {self.lesson.title}"