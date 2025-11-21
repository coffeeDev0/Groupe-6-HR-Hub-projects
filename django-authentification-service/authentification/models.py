from django.db import models
from django.contrib.auth.models import (
    AbstractBaseUser,
    BaseUserManager,
    PermissionsMixin,
)


class UserManager(BaseUserManager):
    def create_user(
        self,
        userMail,
        userName,
        userForName,
        phoneNumber,
        password=None,
        role="Employee",
    ):
        if not userMail:
            raise ValueError("L'adresse Mail est obligatoire")
        user = self.model(
            userMail=userMail,
            userName=userName,
            userForName=userForName,
            phoneNumber=phoneNumber,
            role=role,
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, userMail, password=None):
        user = self.create_user(userMail, "", "", 000000000, password, role="Admin")
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user


class User(AbstractBaseUser, PermissionsMixin):
    userId = models.AutoField(primary_key=True)
    userMail = models.EmailField(max_length=100, unique=True)
    userName = models.CharField(max_length=100)
    userForName = models.CharField(max_length=100)
    password = models.CharField(max_length=255)
    phoneNumber = models.IntegerField(max_length=9, null=True)
    role = models.CharField(max_length=50, default="Employee")
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = "userMail"
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.userName
