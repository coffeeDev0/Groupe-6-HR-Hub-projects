package com.erpproject.conge_service.repositories;

import java.util.List;
// import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.erpproject.conge_service.models.EmployerDemande;

@Repository
public interface EmployerDemandeRepositorie extends JpaRepository<EmployerDemande, UUID> {


        // Recherche par employé
        List<EmployerDemande> findByEmployer_UserId(UUID userId);

        // // Recherche par demande
        // List<EmployerDemande> findByDemandeId(UUID demandeId);


}