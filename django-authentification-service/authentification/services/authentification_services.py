from authentification.models import User
from services.password_hasher import PasswordHasher
from services.jwt_provider import JwtProvider


class AuthenticationService:

    @staticmethod
    def authenticate_user(userName: str, password: str):
        try:
            user = User.objects.get(userName=userName)
        except User.DoesNotExist:
            return None

        if PasswordHasher.verify(password, user.password):
            return user

        return None

    @staticmethod
    def generate_token(user: User):
        return JwtProvider.create_token(user)
