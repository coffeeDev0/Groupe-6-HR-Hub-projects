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
    public  Optional<UserRequest> findById(UUID id) {
        Optional<User> user = userRepository.findById(id);
        return user.map(userMapper::toDto);
    }

    @Override
    public Optional<UserRequest> findByName(String userName) {
        List<User> users = userRepository.findAll();
        Optional<User> user = users.stream()
            .filter(u -> u.getUserName().equals(userName))
            .findFirst();
        return user.map(userMapper::toDto);
    }

    @Override
    public Boolean deleteUser(UUID id){
        Optional<User> user = userRepository.findById(id);
        if(user.isEmpty()){
            return false;
        }else{
            try{
                userRepository.delete(user.get());
                return true;
            }catch(Exception e){
                e.getMessage();
                return false;
            }
        }

    }

    @Override
    public String updatePassword(UUID id, String password){
        Optional<User> user = userRepository.findById(id);
        if(user.isEmpty()){
            throw new IllegalArgumentException("Utilisateur non trouver");
        }
        User user2 = user.get();
        user2.setUserPassword(password);
        userRepository.save(user2);

        return "Password update";
    }

    @Override
    public Boolean deleteByName(String userName){
        Optional<UserRequest> userRequest = findByName(userName);
        if(userRequest.isEmpty()){
            return false;
        }

        User user = userMapper.toEntity(userRequest.get());
        userRepository.delete(user);
        return true;
    }

}
