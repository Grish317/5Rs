from django.urls import path
from .views import log_task, get_my_logs

urlpatterns = [
    path('log-task', log_task),
    path('my-logs', get_my_logs),
]
