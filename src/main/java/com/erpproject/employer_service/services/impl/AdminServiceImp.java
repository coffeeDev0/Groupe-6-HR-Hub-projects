package com.erpproject.employer_service.services.impl;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.erpproject.employer_service.communication.NotificationService;
import com.erpproject.employer_service.models.Admin;
import com.erpproject.employer_service.models.Rh;
import com.erpproject.employer_service.models.Roles;
import com.erpproject.employer_service.models.User;
import com.erpproject.employer_service.models.dto.UserRequest;
import com.erpproject.employer_service.repository.AdminRepository;
import com.erpproject.employer_service.repository.RhRepositorie;
import com.erpproject.employer_service.repository.UserRepository;
import com.erpproject.employer_service.services.AdminService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminServiceImp implements AdminService {

    @Value("${admin.name}")
    private String adminName;

    @Value("${admin.password}")
    private String adminPassword;

    private final AdminRepository adminRepository;
    private final UserRepository userRepository;
    private final RhRepositorie rhRepositorie;
    private final NotificationService notificationService;

    @Override
    @Transactional
    public String attributRole(User user, Roles role) {

        if (user.getRole().equalsIgnoreCase(Roles.EMPLOYER.name()) && role == Roles.RH) {

            Rh rh = new Rh();
            rh.setUserId(user.getUserId());
            rh.setUserName(user.getUserName());
            rh.setUserPassword(user.getUserPassword());
            rh.setRole(Roles.RH.name());

            userRepository.delete(user);

            rhRepositorie.save(rh);

            UserRequest rhRequest = new UserRequest();
            rhRequest.setUserId(rh.getUserId());
            rhRequest.setUserName(rh.getUserName());
            rhRequest.setUserPassword(rh.getUserPassword());
            rhRequest.setRole(rh.getRole());

            notificationService.notifyNewRh(rhRequest);

            return "User changed from EMPLOYER to RH: " + rh.getUserName();
        }

        user.setRole(role.name());
        userRepository.save(user);
        return "Role " + role.name() + " attributed to user " + user.getUserName();
    }


    @Override
    @Transactional
    public void createAdmin() {
        if (adminRepository.count() == 0) {
            Admin admin = new Admin();
            admin.setUserName(adminName);
            admin.setUserPassword(adminPassword); 
            admin.setRole(Roles.ADMIN.name());
            adminRepository.save(admin);
            
            UserRequest adminRequest = new UserRequest();
            adminRequest.setUserId(admin.getUserId());
            adminRequest.setUserName(admin.getUserName());
            adminRequest.setUserPassword(admin.getUserPassword());
            adminRequest.setRole(admin.getRole());

            notificationService.notifyNewRh(adminRequest);
        }
    }
}