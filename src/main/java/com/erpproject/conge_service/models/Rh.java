package com.erpproject.conge_service.models;

import java.util.List;
import java.util.UUID;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.Data;

@Entity
@Data
public class Rh {
    @Id
    private UUID userId ;
    private String userName;
    private String userPassword;
    private String role = "RH";

    @OneToMany(mappedBy = "rh")
    private List<Employer> employers;

}
