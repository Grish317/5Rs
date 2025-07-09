from django.contrib import admin
from django.utils import timezone


# Register your models here.

from django.contrib import admin
from .models import KYC, Group, Message

@admin.register(KYC)
class KYCAdmin(admin.ModelAdmin):
    list_display = ('user', 'status', 'verified_by', 'verified_at')
    list_filter = ('status',)
    actions = ['approve_kyc', 'reject_kyc']

    def approve_kyc(self, request, queryset):
        updated = queryset.update(status='approved', verified_by=request.user, verified_at=timezone.now())
        self.message_user(request, f"{updated} KYC(s) approved.")
    approve_kyc.short_description = "Approve selected KYCs"

    def reject_kyc(self, request, queryset):
        updated = queryset.update(status='rejected', verified_by=request.user, verified_at=timezone.now())
        self.message_user(request, f"{updated} KYC(s) rejected.")
    reject_kyc.short_description = "Reject selected KYCs"

@admin.register(Group)
class GroupAdmin(admin.ModelAdmin):
    list_display = ('name', 'description', 'created_at')
    search_fields = ('name',)

@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ('group', 'sender', 'timestamp', 'content')
    search_fields = ('content', 'sender__username', 'group__name')
    readonly_fields = ('timestamp',)
