from django.contrib import admin
from .models import User


class UserAdmin(admin.ModelAdmin):
    list_display = (
        "userId",
        "userMail",
        "userName",
        "userForName",
        "phoneNumber",
        "role",
    )


admin.site.register(User, UserAdmin)
