import pika
import json
import threading
import os
from django.conf import settings


# === Configuration RabbitMQ ===
RABBITMQ_HOST = os.getenv("RABBITMQ_HOST", "localhost")
RABBITMQ_PORT = int(os.getenv("RABBITMQ_PORT", 5672))
RABBITMQ_USER = os.getenv("RABBITMQ_USER", "guest")
RABBITMQ_PASS = os.getenv("RABBITMQ_PASS", "guest")
EXCHANGE = os.getenv("RABBITMQ_EXCHANGE", "employer_exchange")

# Deux files et clés de routage
EMPLOYER_QUEUE = os.getenv("RABBITMQ_EMPLOYER_QUEUE", "employer_queue")
RH_QUEUE = os.getenv("RABBITMQ_RH_QUEUE", "rh_queue")
EMPLOYER_ROUTING_KEY = os.getenv("RABBITMQ_EMPLOYER_ROUTING_KEY", "employer.created")
RH_ROUTING_KEY = os.getenv("RABBITMQ_RH_ROUTING_KEY", "rh.created")

credentials = pika.PlainCredentials(RABBITMQ_USER, RABBITMQ_PASS)
connection_params = pika.ConnectionParameters(
    host=RABBITMQ_HOST, port=RABBITMQ_PORT, credentials=credentials
)


def process_user_event(data, role_label):
    """Traite la création d'un utilisateur selon son rôle (Employé ou RH)"""
    from authentification.models import User

    try:
        userName = data.get("userName")
        userForName = data.get("userPrenom")
        userMail = data.get("email")
        password = data.get("userPassword")
        phoneNumber = data.get("tel")
        role = data.get("role", role_label)

        # Vérification minimale
        if not userMail or not password:
            print(f"⚠️ [{role_label}] Message incomplet, ignoré.")
            return

        # Création ou mise à jour du compte
        user, created = User.objects.get_or_create(userMail=userMail)
        user.userName = userName
        user.userForName = userForName
        user.phoneNumber = phoneNumber
        user.role = role
        user.set_password(password)
        user.save()

        if created:
            print(f"✅ [{role_label}] Nouvel utilisateur créé : {userName}")
        else:
            print(f"♻️ [{role_label}] Utilisateur mis à jour : {userName}")

    except Exception as e:
        print(f"❌ [{role_label}] Erreur lors du traitement : {e}")


def handle_employer_message(ch, method, properties, body):
    """Callback pour les événements d’employés"""
    try:
        data = json.loads(body)
        print(f"📥 [AUTH] Événement employé reçu : {data}")
        process_user_event(data, "EMPLOYER")
    except Exception as e:
        print(f"❌ [AUTH] Erreur employer : {e}")


def handle_rh_message(ch, method, properties, body):
    """Callback pour les événements RH"""
    try:
        data = json.loads(body)
        print(f"📥 [AUTH] Événement RH reçu : {data}")
        process_user_event(data, "RH")
    except Exception as e:
        print(f"❌ [AUTH] Erreur RH : {e}")


def start_rabbit_listener():
    """Démarre un thread d'écoute RabbitMQ pour RH + Employé"""

    def _consume():
        try:
            connection = pika.BlockingConnection(connection_params)
            channel = connection.channel()

            # Déclarations
            channel.exchange_declare(
                exchange=EXCHANGE, exchange_type="topic", durable=True
            )
            channel.queue_declare(queue=EMPLOYER_QUEUE, durable=True)
            channel.queue_declare(queue=RH_QUEUE, durable=True)

            # Liaison des queues à leurs clés
            channel.queue_bind(
                exchange=EXCHANGE,
                queue=EMPLOYER_QUEUE,
                routing_key=EMPLOYER_ROUTING_KEY,
            )
            channel.queue_bind(
                exchange=EXCHANGE, queue=RH_QUEUE, routing_key=RH_ROUTING_KEY
            )

            print(f"👂 [AUTH] En écoute sur :")
            print(f"   → {EMPLOYER_QUEUE} ({EMPLOYER_ROUTING_KEY})")
            print(f"   → {RH_QUEUE} ({RH_ROUTING_KEY})")

            # Deux consommateurs
            channel.basic_consume(
                queue=EMPLOYER_QUEUE,
                on_message_callback=handle_employer_message,
                auto_ack=True,
            )
            channel.basic_consume(
                queue=RH_QUEUE, on_message_callback=handle_rh_message, auto_ack=True
            )

            channel.start_consuming()
        except Exception as e:
            print(f"❌ [AUTH] Erreur de connexion RabbitMQ : {e}")

    threading.Thread(target=_consume, daemon=True).start()
