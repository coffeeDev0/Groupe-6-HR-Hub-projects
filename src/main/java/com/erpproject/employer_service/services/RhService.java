package com.erpproject.employer_service.services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.erpproject.employer_service.models.dto.EmployerRequest;
import com.erpproject.employer_service.models.dto.RhResult;

@Service
public interface RhService {
    public RhResult createRh(EmployerRequest employerRequest);

    public List<RhResult> findAllRh();
}
