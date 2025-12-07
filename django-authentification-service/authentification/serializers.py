from rest_framework.serializers import ModelSerializer, CharField, ValidationError

from django.contrib.auth.password_validation import validate_password

from authentification.models import User


class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = (
            "userId",
            "userMail",
            "userName",
            "userForName",
            "phoneNumber",
            "role",
        )
        read_only_fields = ("userId", "role")


class RegisterSerializer(ModelSerializer):
    password = CharField(write_only=True, required=True)
    password2 = CharField(write_only=True, required=True, label="Confirm Password")
    role = CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = (
            "userId",
            "userMail",
            "userName",
            "userForName",
            "password",
            "password2",
            "phoneNumber",
            "role",
        )
        read_only_fields = ("userId",)

    def validate(self, attrs):
        if attrs.get("password") != attrs.get("password2"):
            raise ValidationError(
                {"password": "Les mots de passe ne correspondent pas."}
            )
        validate_password(attrs.get("password"))

        valid_roles = [choice[0] for choice in User.TypeRole.choices]
        if attrs.get("role") not in valid_roles:
            raise ValidationError({"role": "Rôle invalide"})
        if attrs.get("role") == User.TypeRole.ADMIN:
            raise ValidationError(
                {"role": "l'enregistrement en tant qu'admin n'est pas autorisée."}
            )

        email = attrs.get("userMail")
        if User.objects.filter(userMail__iexact=email).exists():
            raise ValidationError({"userMail": "Cet email est déjà utilisé."})

        return attrs

    def create(self, validated_data):
        validated_data["userMail"] = validated_data["userMail"].lower()
        validated_data.pop("password2")
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        user.save()

        return user
