package com.erpproject.employer_service.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.erpproject.employer_service.models.Roles;
import com.erpproject.employer_service.models.User;
import com.erpproject.employer_service.repository.UserRepository;
import com.erpproject.employer_service.services.AdminService;

import lombok.Data;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.Optional;
import java.util.UUID;

import org.springframework.web.bind.annotation.PathVariable;


@RestController
@RequestMapping("/admin")
@Data
public class AdminController {
    private final UserRepository userRepository;
    private final AdminService adminService;
    @PostMapping("attribute/{id}")
    public String attributUserRole(@PathVariable String id, @RequestBody Roles role) {
        UUID userId = UUID.fromString(id);

        if(userId == null){
            throw new IllegalArgumentException("user not foud");
        }
        Optional <User> user = userRepository.findById(userId);

        if(user.isEmpty()){
            throw new IllegalArgumentException(" With id"+id+" not found");
        }
        return adminService.attributRole(user.get(), role);
    }
}

