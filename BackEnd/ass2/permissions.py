from rest_framework import permissions

class IsAdminUser(permissions.BasePermission):
    """
    允许管理员用户访问。
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and hasattr(request.user, 'profile') and request.user.profile.is_admin