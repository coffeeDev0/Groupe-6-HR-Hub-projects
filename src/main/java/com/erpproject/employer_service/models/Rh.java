package com.erpproject.employer_service.models;

import java.util.List;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "rh")
public class Rh extends Employer {

    @OneToMany
    private List<Employer> employers;
}