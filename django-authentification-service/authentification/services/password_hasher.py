from django.contrib.auth.hashers import make_password, check_password


class PasswordHasher:

    @staticmethod
    def hash(password: str):
        return make_password(password)

    @staticmethod
    def verify(password: str, hash: str):
        return check_password(password, hash)
