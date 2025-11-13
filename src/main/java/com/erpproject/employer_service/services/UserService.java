package com.erpproject.employer_service.services;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.erpproject.employer_service.models.dto.UserRequest;

@Service
public interface UserService {
    public List<UserRequest> findAllUsers();

    public Optional<UserRequest> findById(UUID id);

    public Optional <UserRequest> findByName(String userName);

    public Boolean deleteUser(UUID id);

    public String updatePassword(UUID id, String password);

    public Boolean deleteByName(String userName);
}
