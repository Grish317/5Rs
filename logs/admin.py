from django.contrib import admin

# Register your models here.

from .models import Log
from .models import Badge, UserBadge

admin.site.register(Badge)
admin.site.register(UserBadge)

admin.site.register(Log)
