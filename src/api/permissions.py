
from rest_framework import permissions

class IsAuthenticatedUser(permissions.BasePermission):
    """
    Faqat autentifikatsiya qilingan foydalanuvchilarga ruxsat beradi.
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated