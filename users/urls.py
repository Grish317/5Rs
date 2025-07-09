from django.urls import path
from .views import RegisterView, LoginView, KYCUploadView, KYCStatusView, GroupListAPIView, MessageCreateAPIView, GroupMessagesAPIView, CreateMessageAPIView


urlpatterns = [
    path('signup/', RegisterView.as_view(), name='signup'),  # becomes /api/signup/
    path('login/', LoginView.as_view(), name='login'),      # becomes /api/login/
    path('kyc-upload/', KYCUploadView.as_view(), name='kyc-upload'),
    path('kyc-status/', KYCStatusView.as_view(), name='kyc-status'),
    path('groups/', GroupListAPIView.as_view(), name='group-list'),
    path('message/', CreateMessageAPIView.as_view(), name='message-create'),
    path('groups/<int:group_id>/messages/', GroupMessagesAPIView.as_view(), name='group-messages'),  # 👈 Add this
]
