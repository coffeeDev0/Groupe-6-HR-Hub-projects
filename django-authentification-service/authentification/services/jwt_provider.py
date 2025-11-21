import jwt
from datetime import datetime, timedelta
from django.conf import settings


class JwtProvider:
    SECRET_KEY = settings.SECRET_KEY
    ALGORITHM = "HS256"

    @staticmethod
    def create_token(user):
        payload = {
            "userId": user.userId,
            "userName": user.userName,
            "role": user.role,
            "exp": datetime.utcnow() + timedelta(hours=1),
            "iat": datetime.utcnow(),
        }
        return jwt.encode(
            payload, JwtProvider.SECRET_KEY, algorithm=JwtProvider.ALGORITHM
        )

    @staticmethod
    def validate_token(token):
        try:
            jwt.decode(
                token, JwtProvider.SECRET_KEY, algorithms=[JwtProvider.ALGORITHM]
            )
            return True
        except jwt.ExpiredSignatureError:
            return False
        except jwt.InvalidTokenError:
            return False

    @staticmethod
    def get_claims(token):
        return jwt.decode(
            token, JwtProvider.SECRET_KEY, algorithms=[JwtProvider.ALGORITHM]
        )
