package com.erpproject.employer_service.services.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.erpproject.employer_service.communication.NotificationService;
import com.erpproject.employer_service.dto.EmployerRequest;
import com.erpproject.employer_service.dto.RhResult;
import com.erpproject.employer_service.dto.UserRequest;
import com.erpproject.employer_service.mapper.RhMapper;
import com.erpproject.employer_service.models.Rh;
import com.erpproject.employer_service.models.Roles;
import com.erpproject.employer_service.repository.RhRepositorie;
import com.erpproject.employer_service.secutity.PasswordUtils;
import com.erpproject.employer_service.services.RhService;
import com.erpproject.employer_service.services.UserService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RhServiceImpl implements RhService {
    
    private final RhRepositorie rhRepository;
    private final RhMapper rhMapper;
    private final NotificationService notificationService;
    private final UserService userService;
    private final PasswordUtils passwordUtils;

    @Override
    public RhResult createRh(EmployerRequest employerRequest) {

        Rh rh = new Rh();

        if(userService.findByEmail(employerRequest.getEmail()).isPresent()){
            throw new IllegalArgumentException("Email deja utiliser");
        }

        rh.setUserName(employerRequest.getUserName());
        rh.setUserPassword(passwordUtils.hashPassword(employerRequest.getUserPassword()));
        rh.setEmail(employerRequest.getEmail());
        rh.setTel(employerRequest.getTel());
        rh.setUserPrenom(employerRequest.getUserPrenom());
        
        Optional<Rh> rh2 = rhRepository.findById(employerRequest.getRhId());
        
        if(rh2.isEmpty()){
            throw new IllegalArgumentException("Rh not found with id: " + employerRequest.getRhId());
        }
        rh.setRh(rh2.get());
        

        RhResult rhResult = rhMapper.toDto(rh);

        Rh rhSaved = rhRepository.save(rh);
        UserRequest rhRequest = new UserRequest();
        rhRequest.setUserId(rhSaved.getUserId());
        rhRequest.setUserName(rhSaved.getUserName());
        rhRequest.setUserPassword(rhSaved.getUserPassword());
        rhRequest.setEmail(rhSaved.getEmail());
        rhRequest.setTel(rhSaved.getTel());
        rhRequest.setUserPrenom(rhSaved.getUserPrenom());
        rhRequest.setRole(Roles.RH.name());
        notificationService.notifyNewRh(rhRequest);
        
        return rhResult;
    }

    @Override
    public List<RhResult> findAllRh() {
        List<Rh> rhList = rhRepository.findAll();
        List<RhResult> rhResults = rhList.stream()
                .map(rhMapper::toDto)
                .toList();
        return rhResults;
    }
}
