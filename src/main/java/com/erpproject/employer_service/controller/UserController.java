package com.erpproject.employer_service.controller;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import com.erpproject.employer_service.models.dto.UserRequest;
import com.erpproject.employer_service.services.UserService;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {
    
    private final UserService userService;

    @GetMapping("/all")
    public ResponseEntity<List<UserRequest>> getAllUsers() {
        List<UserRequest> users = userService.findAllUsers();
        return ResponseEntity.ok(users);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<UserRequest> getUserById(UUID id) {
        Optional<UserRequest> user = userService.findById(id);
        return user.map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/name/{userName}")
    public ResponseEntity<UserRequest> getUserByName(String userName) {
        Optional<UserRequest> user = userService.findByName(userName);
        return user.map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
