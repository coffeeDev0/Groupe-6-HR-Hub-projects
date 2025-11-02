package com.erpproject.conge_service.repositories;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.erpproject.conge_service.models.Demande;

@Repository
public interface DemandeRepositorie extends JpaRepository<Demande, UUID> {
    
    
    // Recherche par statut
    List<Demande> findByStatus(String status);
    
    // Recherche par raison
    List<Demande> findByRaisonContainingIgnoreCase(String raison);
    
    // Compter les demandes par statut
    @Query("SELECT COUNT(d),d.status FROM Demande d WHERE d.status = :status")
    long countByStatus(@Param("status") String status);
    
    // Demandes entre deux dates
    @Query("SELECT d FROM Demande d JOIN d.employerDemandes ed " +
        "WHERE ed.dateDebut >= :dateDebut AND ed.dateFin <= :dateFin")
    List<Demande> findByDateRange(@Param("dateDebut") java.time.LocalDate dateDebut, 
            @Param("dateFin") java.time.LocalDate dateFin);

}