# Demarche pour lancer les services sur docker

## 1 - Tout d'abors vous devez generer les .jar qui seront utiliser pour creer les images Docker

**Prerequis** :

- Maven doit etre installer sur votre machine
- Docker doit etre installer sur votre machine
- Java 21 doit etre installer sur votre machine
- Assurez vous d'avoir la derniers version du projet en local

**PreProcessus** :

- generer le .jar du service de configuration avec la commmande:

    ```bash
        mvn clean package
    ```

    **Nb**: assurer vous d'etre dans le dossier "bank_config_service"

- Lancer le service de configuration

    ```bash
        java -jar target/bank_config_service.jar
    ```

- Lancer la commande suivante pour chaque service pour generer les .jar

    ```bash
    mvn clean package
    ```

    **Nb**: Assurez vous d'etre dans le dossier de chaque service avant de lancer la commande

## 2 - Lancer les services avec Docker

**Prerequis** :

- cloner le repot de configuration des services qui sont sur: https://github.com/banking-project-chenjo/cloud-conf.git via la commande

    ```bash
    git clone https://github.com/banking-project-chenjo/cloud-conf.git
    ```

- Allez dans le dossier *cloud-conf* et pour les fichiers **conge-service.properties** et **employer-service.properties** :

    - Reperer les ligne qui comporte **localhost** (***astuce**: faire Ctrl+F et rechercher "localhost"*) puis vous commenter ces lignes en faisais *Ctrl+/*

    - Decommenter les lignes juste au dessus d'eux (***Explication**: les localhost sont utiliser pour les utilisations en local pour une utilisation avec docker on remplace le localhost par le nom du service concerner*)

- Une fois les modification effectuer, faite:

    ```bash
    git add .
    git commit -m "modification des fichiers de configuration pour docker"
    git push
    ```

**Lancement des services** :

- Allez dans le dossier qui comoporte le fichier *docker-compose.yml* puis lancer la commande:

    ```bash
    docker-compose up -d --build
    ```

    **Nb**: Cette commande va lancer tout les services sauf conge_db et employer_db

- Ouvrer un autre terminal puis lancer les commandes suivantes pour creer les bases de donnes:

    ```bash
    sudo docker exec -it postgres-db psql -U prosper
    CREATE DATABASE conge_db;
    CREATE DATABASE employer_db;
    \q
    ```

    **Nb**: Assurez vous que le conteneur de la base de donnes postgres-db est bien lancer avant d'executer cette commande

- Relancer la commande pour lancer les services:

    ```bash
    docker-compose up --build
    ```

    **Nb**: Cette fois ci tout les services y compris conge_db et employer_db seront lancer

- Verifier que tout les services sont bien lancer en faisant:

    ```bash
    docker ps
    ```

- Verifier si tout les services fonctionne correctement en allant sur:

    - http://localhost:8761/

    **Nb**: Ceci est l'url de eureka server ou vous devez voir tout les services enregistrer

## Tests des requests dans docker avec l'api gatewat

La difference entre les requestes traditionnel ( *curl -X GET http://localhost:8085/users/all* ) qui s'adressent directement au service et les requestes qui passe par l'api gateway( *curl -X GET http://localhost:8000/EMPLOYER-SERVICE/users/all* ) est que dans le deuxieme cas on doit ajouter le nom du service dans l'url et on n'a pas besoin de preciser le port.

- Tester la request pour recuperer tout les employers:

    ```bash
    curl -X GET http://localhost:8000/EMPLOYER-SERVICE/employers/all
    ```

    **Nb**: Ainsi donc pour l'indegration ceci doit etre appliquer a toute les requestes

**Congratulation**! Vous avez reussi a lancer les services avec docker, pour des problemes ou des questions n'hesitez pas a contacter chatgpt.com 😂😂
