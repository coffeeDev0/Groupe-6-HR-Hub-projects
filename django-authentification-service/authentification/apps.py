from django.apps import AppConfig


class AuthentificationConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "authentification"

    def ready(self):
        from .rabbit_listener import start_rabbit_listener
        from .eureka_client import start_eureka_client

        start_rabbit_listener()
        start_eureka_client()
