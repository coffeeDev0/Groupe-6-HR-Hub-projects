package com.erpproject.employer_service.controller;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import com.erpproject.employer_service.models.dto.UserRequest;
import com.erpproject.employer_service.services.UserService;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {
    
    private final UserService userService;

    @Operation(summary="afficher tout les utilisateurs")
    @GetMapping("/all")
    public ResponseEntity<List<UserRequest>> getAllUsers() {
        List<UserRequest> users = userService.findAllUsers();
        return ResponseEntity.ok(users);
    }
    
    @Operation(summary="rechercher un utilisateur par son id")
    @GetMapping("/{id}")
    public ResponseEntity<UserRequest> getUserById(UUID id) {
        Optional<UserRequest> user = userService.findById(id);
        return user.map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @Operation(summary="rechercher un utilisateur par son nom")
    @GetMapping("/name/{userName}")
    public ResponseEntity<UserRequest> getUserByName(String userName) {
        Optional<UserRequest> user = userService.findByName(userName);
        return user.map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @Operation(summary="supprimer un utilisateur")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleEntity(UUID id){
        if(userService.deleteUser(id)){
            return ResponseEntity.ok("delete sucess");
        }else{
            throw new IllegalArgumentException("une erreur est survenue");
        }
    }

    @Operation(summary = "mettre a jour le mot de passe d'un user")
    @PutMapping("update/{id}")
    public ResponseEntity<String> updatePasswordd(@PathVariable UUID id, @RequestBody String password) {
        
        return ResponseEntity.ok(userService.updatePassword(id, password) );
    }

}
