package com.erpproject.employer_service.services.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.erpproject.employer_service.mapper.RhMapper;
import com.erpproject.employer_service.models.Rh;
import com.erpproject.employer_service.models.dto.EmployerRequest;
import com.erpproject.employer_service.models.dto.RhResult;
import com.erpproject.employer_service.repository.RhRepositorie;
import com.erpproject.employer_service.services.RhService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RhServiceImpl implements RhService {
    
    private final RhRepositorie rhRepository;
    private final RhMapper rhMapper;

    @Override
    public RhResult createRh(EmployerRequest employerRequest) {

        Rh rh = new Rh();

        rh.setUserName(employerRequest.getUserName());
        rh.setUserName(employerRequest.getUserPassword());
        Optional<Rh> rh2 = rhRepository.findById(employerRequest.getRhId());
        
        if(rh2.isEmpty()){
            throw new IllegalArgumentException("Rh not found with id: " + employerRequest.getRhId());
        }
        rh.setRh(rh2.get());
        

        RhResult rhResult = rhMapper.toDto(rh);
        rhRepository.save(rh);
        return rhResult;
    }

    @Override
    public List<RhResult> findAllRh() {
        List<Rh> rhList = rhRepository.findAll();
        return rhList.stream()
                .map(rhMapper::toDto)
                .toList();
    }
}
