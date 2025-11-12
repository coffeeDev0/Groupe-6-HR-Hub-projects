package com.erpproject.employer_service.mapper;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.erpproject.employer_service.models.Employer;
import com.erpproject.employer_service.models.Rh;
import com.erpproject.employer_service.models.Roles;
import com.erpproject.employer_service.models.dto.EmployerRequest;
import com.erpproject.employer_service.models.dto.EmployerResult;
import com.erpproject.employer_service.models.dto.RhResult;
import com.erpproject.employer_service.repository.RhRepositorie;

import lombok.Data;

@Data
@Component
public class RhMapper {

    private EmployerMapper employerMapper;

    @Autowired
    private RhRepositorie rhRepositorie;
    
    public RhResult toDto(Rh rh) {
        RhResult rhResult = new RhResult();
        rhResult.setId(rh.getUserId());
        rhResult.setUserName(rh.getUserName());
        rhResult.setUserPassword(rh.getUserPassword());
        rhResult.setRole(rh.getRole());
        rhResult.setRhId(rh.getUserId());

        List<Employer> employers = rh.getEmployers();

        List<EmployerResult> employerResults = employers.stream()
                .map(employer -> employerMapper.toDto(employer))
                .toList();
        rhResult.setEmployers(employerResults);

        return rhResult;
    }

    public Rh toEntity(EmployerRequest employer){
        Rh rh = new Rh();
        rh.setUserName(employer.getUserName());
        rh.setUserPassword(employer.getUserPassword());

        Optional<Rh> optionalRh = rhRepositorie.findById(employer.getRhId());
        if (optionalRh.isPresent()) {
            rh.setRh(optionalRh.get());
        } else {
            throw new IllegalArgumentException("Rh not found with id: " + employer.getRhId());
        }

        rh.setRole(Roles.RH.name());
        
        return rh;
    }
}
