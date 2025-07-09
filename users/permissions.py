# users/permissions.py
from rest_framework.permissions import BasePermission

class IsKYCVerified(BasePermission):
    """
    Allows access only to users with approved KYC.
    """

    def has_permission(self, request, view):
        user = request.user
        # Assuming you have a related KYC model and status field
        return (
            user.is_authenticated and
            hasattr(user, 'kyc') and
            user.kyc.status == 'approved'
        )
