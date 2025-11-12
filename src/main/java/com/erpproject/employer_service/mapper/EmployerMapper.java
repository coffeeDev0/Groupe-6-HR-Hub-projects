package com.erpproject.employer_service.mapper;

import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.erpproject.employer_service.models.Employer;
import com.erpproject.employer_service.models.Rh;
import com.erpproject.employer_service.models.Roles;
import com.erpproject.employer_service.models.dto.EmployerRequest;
import com.erpproject.employer_service.models.dto.EmployerResult;
import com.erpproject.employer_service.repository.RhRepositorie;

import lombok.Data;

@Data
@Component
public class EmployerMapper {

    @Autowired
    private RhRepositorie rhRepositorie;

    public Employer toEntity(EmployerRequest employerRequest) {
        Employer employer = new Employer();
        employer.setUserName(employerRequest.getUserName());
        employer.setUserPassword(employerRequest.getUserPassword());

        Optional<Rh> optionalRh = rhRepositorie.findById(employerRequest.getRhId());
        if (optionalRh.isPresent()) {
            employer.setRh(optionalRh.get());
        } else {
            throw new IllegalArgumentException("Rh not found with id: " + employerRequest.getRhId());
        }

        employer.setRole(Roles.EMPLOYER.name());
        return employer;
    }

    public EmployerResult toDto(Employer employer) {
        EmployerResult employerResult = new EmployerResult();
        employerResult.setUserId(employer.getUserId());
        employerResult.setUserName(employer.getUserName());
        employerResult.setRole(employer.getRole());
        employerResult.setUserPassword(employer.getUserPassword());
        if (employer.getRh() != null) {
            employerResult.setRhId(employer.getRh().getUserId());
        }
        return employerResult;
    }
}
