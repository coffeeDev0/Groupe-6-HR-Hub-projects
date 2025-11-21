import os, requests, socket, schedule, time, threading

EUREKA_SERVER = os.getenv("EUREKA_SERVER", "http://localhost:8761/eureka")
SERVICE_NAME = os.getenv("SERVICE_NAME", "AUTH-SERVICE")
PORT = int(os.getenv("PORT", 8000))


def register_to_eureka():
    hostname = socket.gethostname()
    ip = socket.gethostbyname(hostname)

    payload = {
        "instance": {
            "instanceId": f"{SERVICE_NAME}:{PORT}",
            "hostName": hostname,
            "app": SERVICE_NAME,
            "ipAddr": ip,
            "vipAddress": SERVICE_NAME.lower(),
            "status": "UP",
            "port": {"$": PORT, "@enabled": "true"},
            "dataCenterInfo": {
                "@class": "com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo",
                "name": "MyOwn",
            },
        }
    }

    try:
        r = requests.post(f"{EUREKA_SERVER}/apps/{SERVICE_NAME}", json=payload)
        print(f"✅ Enregistré sur Eureka: {r.status_code}")
    except Exception as e:
        print(f"⚠️ Erreur d’enregistrement Eureka: {e}")


def send_heartbeat():
    try:
        requests.put(f"{EUREKA_SERVER}/apps/{SERVICE_NAME}/{SERVICE_NAME}:{PORT}")
    except Exception as e:
        print(f"⚠️ Erreur Heartbeat: {e}")


def start_eureka_client():
    register_to_eureka()
    schedule.every(30).seconds.do(send_heartbeat)
    threading.Thread(target=lambda: run_scheduler(), daemon=True).start()


def run_scheduler():
    while True:
        schedule.run_pending()
        time.sleep(1)
