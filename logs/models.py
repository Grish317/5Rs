from django.db import models
from django.conf import settings

class Log(models.Model):
    # ✅ Use AUTH_USER_MODEL as a string reference
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="logs")
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.description[:30]}"

class Badge(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    awarded_after = models.IntegerField(help_text="Award after N logs")

    def __str__(self):
        return self.name

class UserBadge(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='user_badges')
    badge = models.ForeignKey(Badge, on_delete=models.CASCADE)
    awarded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'badge')
