package com.erpproject.employer_service.services.impl;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.erpproject.employer_service.mapper.UserMapper;
import com.erpproject.employer_service.models.User;
import com.erpproject.employer_service.models.dto.UserRequest;
import com.erpproject.employer_service.repository.UserRepository;
import com.erpproject.employer_service.services.UserService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    
    private final UserRepository userRepository;
    private final UserMapper userMapper;

    @Override
    public List<UserRequest> findAllUsers(){
    List<User> users = userRepository.findAll();
    List<UserRequest> userRequests = users.stream()
        .map(userMapper::toDto)
        .toList();
        return userRequests;
    }

    @Override
    public  UserRequest findById(UUID id) {
        Optional<User> user = userRepository.findById(id);
        if (user.isEmpty()) {
            throw new IllegalArgumentException("User not found with id: " + id);
        }
        return userMapper.toDto(user.get());
    }

    @Override
    public Optional<UserRequest> findByName(String userName) {
        List<User> users = userRepository.findAll();
        Optional<User> user = users.stream()
            .filter(u -> u.getUserName().equals(userName))
            .findFirst();
        return user.map(userMapper::toDto);
    }
}
