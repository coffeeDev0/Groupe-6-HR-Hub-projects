package com.erpproject.employer_service.services.impl;


import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.stereotype.Service;

import com.erpproject.employer_service.mapper.EmployerMapper;
import com.erpproject.employer_service.models.Employer;
import com.erpproject.employer_service.models.dto.EmployerRequest;
import com.erpproject.employer_service.models.dto.EmployerResult;
import com.erpproject.employer_service.repository.EmployerRepositorie;
import com.erpproject.employer_service.services.EmployerService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmployerServiceImpl implements EmployerService {

    private final EmployerRepositorie employerRepositorie;
    private final EmployerMapper employerMapper;


    @Override
    public EmployerResult createAndNotifyEmployer(EmployerRequest employerRequest) throws Exception {
        Employer employer = employerMapper.toEntity(employerRequest);
        if(employer.getRh() == null){
            throw new Exception("Rh not found for the employer");
        }
        Employer savedEmployer = employerRepositorie.save(employer);
        EmployerResult savedEmployerResult = employerMapper.toDto(savedEmployer);
        return savedEmployerResult;
    }


    @Override
    public List<Employer> findAllEmployer() {
        return employerRepositorie.findAll();
    }

}
