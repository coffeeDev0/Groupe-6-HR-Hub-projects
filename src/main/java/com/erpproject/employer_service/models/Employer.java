package com.erpproject.employer_service.models;

import jakarta.persistence.*;
import lombok.Data;


@Entity
@Data
@Table(name = "employer")
public class Employer extends User {
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rh_id")
    private Rh rh;
}
