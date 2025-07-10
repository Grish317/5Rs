from django.urls import path
from .views import RegisterView, LoginView, KYCUploadView, KYCStatusView, GroupListAPIView, MessageCreateAPIView, GroupMessagesAPIView, CreateMessageAPIView, user_profile, TaskListView, ApplyTaskView, get_learning_tracks, get_lessons_by_track, log_lesson


urlpatterns = [
    path('signup/', RegisterView.as_view(), name='signup'),  # becomes /api/signup/
    path('login/', LoginView.as_view(), name='login'),      # becomes /api/login/
    path('kyc-upload/', KYCUploadView.as_view(), name='kyc-upload'),
    path('kyc-status/', KYCStatusView.as_view(), name='kyc-status'),
    path('groups/', GroupListAPIView.as_view(), name='group-list'),
    path('message/', CreateMessageAPIView.as_view(), name='message-create'),
    path('groups/<int:group_id>/messages/', GroupMessagesAPIView.as_view(), name='group-messages'),  # 👈 Add this
    path('me', user_profile),
    path('tasks/', TaskListView.as_view(), name='task-list'),
    path('apply-task/', ApplyTaskView.as_view(), name='apply-task'),
    path('learning-tracks/', get_learning_tracks, name='learning-tracks'),
    path('lessons/<int:track_id>/', get_lessons_by_track, name='lessons-by-track'),
    path('log-lesson/', log_lesson, name='log-lesson'),
]
