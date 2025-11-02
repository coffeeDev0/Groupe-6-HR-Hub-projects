package com.erpproject.conge_service.controllers;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.erpproject.conge_service.dto.DemandeEvaluate;
import com.erpproject.conge_service.dto.DemandeRequest;
import com.erpproject.conge_service.dto.DemandeSearch;
import com.erpproject.conge_service.models.Demande;
import com.erpproject.conge_service.models.Employer;
import com.erpproject.conge_service.models.EmployerDemande;
import com.erpproject.conge_service.repositories.DemandeRepositorie;
import com.erpproject.conge_service.repositories.EmployerDemandeRepositorie;
import com.erpproject.conge_service.repositories.EmployerRepositorie;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;

@RestController
@RequestMapping("/demande/")
public class DemandeController {

    @Autowired
    private DemandeRepositorie demandeRepositorie;

    @Autowired
    private EmployerDemandeRepositorie employerDemandeRepositorie;

    @Autowired
    private EmployerRepositorie employerRepositorie;

    @Operation(summary = "Créer une nouvelle demande de congé")
    @ApiResponse(responseCode = "200", description = "Demande créée avec succès")
    @ApiResponse(responseCode = "404", description = "Employé non trouvé")
    @ApiResponse(responseCode = "400", description = "Données invalides")
    @PostMapping("/{userId}")
    public ResponseEntity<DemandeRequest> createDemande(
            @PathVariable("userId") String userId,
            @RequestBody DemandeRequest demandeRequest) {
        
        try {
            Optional<Employer> employerOpt = employerRepositorie.findById(UUID.fromString(userId));
            if (employerOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            Employer employer = employerOpt.get();

            Demande demande = new Demande();
            demande.setDemandeId(UUID.randomUUID());
            demande.setRaison(demandeRequest.getRaison());
            demande.setStatus("EN COURS");
            Demande savedDemande = demandeRepositorie.save(demande);

            EmployerDemande employerDemande = new EmployerDemande();
            employerDemande.setDateDebut(demandeRequest.getDateDebut());
            employerDemande.setDateFin(demandeRequest.getDateFin());
            employerDemande.setDemande(savedDemande);
            employerDemande.setEmployer(employer);
            
            
            employerDemandeRepositorie.save(employerDemande);
            DemandeRequest demandeResponse = new DemandeRequest();
            demandeResponse.setRaison(savedDemande.getRaison());
            demandeResponse.setDateDebut(employerDemande.getDateDebut());
            demandeResponse.setDateFin(employerDemande.getDateFin());
            return ResponseEntity.ok(demandeResponse);
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @Operation(summary = "Récupérer toutes les demandes")
    @ApiResponse(responseCode = "200", description = "Liste des demandes")
    @GetMapping("/all")
    public ResponseEntity<List<DemandeSearch>> getAllDemandes() {
        List<EmployerDemande> demandes = employerDemandeRepositorie.findAll();
        List<DemandeSearch> demandesSearchs = demandes.stream().map(demande -> {
            DemandeSearch dto = new DemandeSearch();
            dto.setRaison(demande.getDemande().getRaison());
            dto.setDemandeId(demande.getId());
            dto.setEmployerId(demande.getEmployer().getUserId());
            dto.setDateDebut(demande.getDateDebut());
            dto.setDateFin(demande.getDateFin());
            dto.setStatus(demande.getDemande().getStatus());
            dto.setRhId(demande.getEmployer().getRh().getUserId());
            dto.setCommentaire(demande.getDemande().getCommentaire());
            return dto;
        }).toList();
        return ResponseEntity.ok(demandesSearchs);
    }

    @Operation(summary = "Récupérer les demandes d'un employé")
    @GetMapping("/{userId}")
    public ResponseEntity<List<DemandeSearch>> getDemandesByEmployer(@PathVariable("userId") String userId) {
        List<EmployerDemande> demandes = employerDemandeRepositorie.findByEmployer_UserId(UUID.fromString(userId));
        List<DemandeSearch> demandesSearchs = demandes.stream().map(demande -> {
            DemandeSearch dto = new DemandeSearch();
            dto.setRaison(demande.getDemande().getRaison());
            dto.setDemandeId(demande.getId());
            dto.setEmployerId(demande.getEmployer().getUserId());
            dto.setDateDebut(demande.getDateDebut());
            dto.setDateFin(demande.getDateFin());
            dto.setStatus(demande.getDemande().getStatus());
            dto.setRhId(demande.getEmployer().getRh().getUserId());
                        dto.setCommentaire(demande.getDemande().getCommentaire());
            return dto;
        }).toList();
        return ResponseEntity.ok(demandesSearchs);
    }

    @Operation(summary = "Evaluer(accepter/refuser) une demande de congé")
    @PostMapping("/evaluate/{demandeId}")
    public ResponseEntity<String> evaluateDemande(
        @PathVariable("demandeId") String demandeId,
        @RequestBody DemandeEvaluate demandeEvaluate) {
        try {
            Optional<EmployerDemande> demandeOpt = employerDemandeRepositorie.findById(UUID.fromString(demandeId));
            if (demandeOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            EmployerDemande employerDemande = demandeOpt.get();
            Employer employer = employerDemande.getEmployer();
            if (employer.getRh() == null || !employer.getRh().getUserId().equals(demandeEvaluate.getRhId())) {
                return ResponseEntity.status(403).body("Vous n'êtes pas autorisé à évaluer cette demande");
            }
            Demande demande = demandeOpt.get().getDemande();
            demande.setStatus(demandeEvaluate.getStatus());
            demande.setCommentaire(demandeEvaluate.getCommentaire());
            demandeRepositorie.save(demande);
        } catch (Exception e) {
                e.printStackTrace();
                return ResponseEntity.internalServerError().build();
            }
        return ResponseEntity.ok("Statut mis à jour avec succès");
    }
}