package com.erpproject.conge_service.models;

import java.util.Date;
import java.util.UUID;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "employer_demande")
@Data
public class EmployerDemande {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @Column(name = "dateDebut", nullable = false)
    private Date dateDebut;
    
    @Column(name = "dateFin", nullable = false)
    private Date dateFin;
    
    // Relation avec Demande (ManyToOne)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "demande_id", nullable = false)
    private Demande demande;
    
    // Relation avec Employer (ManyToOne)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employer_id", nullable = false)
    private Employer employer;
}