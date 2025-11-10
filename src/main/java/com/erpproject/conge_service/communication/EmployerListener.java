package com.erpproject.conge_service.communication;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;
import com.erpproject.conge_service.models.Employer;

@Service
public class EmployerListener {

    @RabbitListener(queues = "employer_queue")
    public void receiveEmployer(Employer employer) {
        System.out.println("NOUVEL EMPLOYÉ REÇU DANS CONGE-SERVICE: " + employer.getUserName());
        // Ici, tu peux sauvegarder l’employé dans ta base conge-service
    }

    @RabbitListener(queues = "rh_queue")
    public void receiveRh(Object rh) {
        System.out.println("NOUVEAU RH REÇU DANS CONGE-SERVICE");
        // Idem, traitement spécifique si besoin
    }
}
