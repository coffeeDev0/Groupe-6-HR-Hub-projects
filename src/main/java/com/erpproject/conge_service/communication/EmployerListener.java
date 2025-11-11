package com.erpproject.conge_service.communication;

import java.util.Optional;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

import com.erpproject.conge_service.dto.EmployerRequest;
import com.erpproject.conge_service.dto.RhRequest;
import com.erpproject.conge_service.models.Employer;
import com.erpproject.conge_service.models.Rh;
import com.erpproject.conge_service.repositories.EmployerRepositorie;
import com.erpproject.conge_service.repositories.RhRepositorie;

@Service
public class EmployerListener {

    private final EmployerRepositorie employerRepositorie;
    private final RhRepositorie rhRepositorie;

    // Injection par Constructeur (meilleure pratique)
    public EmployerListener(EmployerRepositorie employerRepositorie, RhRepositorie rhRepositorie) {
        this.employerRepositorie = employerRepositorie;
        this.rhRepositorie = rhRepositorie;
    }

    @RabbitListener(queues = RabbitConfig.EMPLOYER_QUEUE, containerFactory = "rabbitListenerContainerFactory")
    public void receiveEmployer(EmployerRequest employerRequest) {
        System.out.println("NOUVEL EMPLOYÉ REÇU DANS CONGE-SERVICE: " + employerRequest.getUserName());

        try {
            // 1. Récupération sûre du RH
            Optional<Rh> rhOpt = rhRepositorie.findById(employerRequest.getRhId());
            
            if (rhOpt.isEmpty()) {
                // ERREUR CRITIQUE: Le RH n'existe pas encore ou l'ID est invalide.
                // On logue l'erreur et on laisse le message s'acquitter (ACK) pour éviter les boucles.
                System.err.println("ERREUR: Impossible de lier l'employé. RH avec ID " + employerRequest.getRhId() + " non trouvé.");
                return; 
            }

            // 2. Mappage et Sauvegarde
            Employer employer = new Employer();
            employer.setUserId(employerRequest.getUserId());
            employer.setUserName(employerRequest.getUserName());
            employer.setUserPassword(employerRequest.getUserPassword());
            employer.setRole(employerRequest.getRole());
            employer.setRh(rhOpt.get()); // Sûr grâce à la vérification
            
            employerRepositorie.save(employer);
            System.out.println("Employé " + employer.getUserName() + " sauvegardé avec succès.");

        } catch (Exception e) {
            System.err.println("Erreur fatale de persistance de l'employé: " + e.getMessage());
            // Relancer l'exception pour que le message soit rejeté/retenté
            throw new RuntimeException("Échec de traitement du message Employeur.", e);
        }
    }

    @RabbitListener(queues = RabbitConfig.RH_QUEUE, containerFactory = "rabbitListenerContainerFactory")
    public void receiveRh(RhRequest rhRequest) {
        System.out.println("NOUVEAU RH REÇU DANS CONGE-SERVICE");

        // 1. Logique d'Upsert (Vérification et Mise à jour ou Création)
        Optional<Rh> existingRh = rhRepositorie.findById(rhRequest.getUserId());
        
        // Utilise le RH existant ou crée une nouvelle instance
        Rh rh = existingRh.orElseGet(Rh::new);
        
        // Mise à jour des champs
        rh.setUserId(rhRequest.getUserId());
        rh.setUserName(rhRequest.getUserName());
        rh.setUserPassword(rhRequest.getUserPassword());
        rh.setRole(rhRequest.getRole());

        // Sauvegarde (fait l'INSERT ou l'UPDATE)
        rhRepositorie.save(rh);
        System.out.println("RH " + rh.getUserName() + " sauvegardé/mis à jour avec succès.");
    }
}