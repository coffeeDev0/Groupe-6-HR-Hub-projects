package com.erpproject.conge_service.models;

import java.util.List;
import java.util.UUID;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "demande")
@Data
public class Demande {
    
    @Id
    // @GeneratedValue(strategy = GenerationType.UUID)
    private UUID demandeId;
    
    @Column(name = "raison", nullable = false)
    private String raison;
    
    @Column(name = "status" )
    private String status= "EN ATTENTE";

    private String commentaire;
    
    // Relation avec EmployerDemande (OneToMany)
    @OneToMany(mappedBy = "demande", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<EmployerDemande> employerDemandes;
}