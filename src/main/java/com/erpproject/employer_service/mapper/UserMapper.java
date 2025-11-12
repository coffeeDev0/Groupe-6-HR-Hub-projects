package com.erpproject.employer_service.mapper;

import org.springframework.stereotype.Component;

import com.erpproject.employer_service.models.User;
import com.erpproject.employer_service.models.dto.UserRequest;

import lombok.Data;

@Data
@Component
public class UserMapper {


    public UserRequest toDto(User user){
        UserRequest userRequest = new UserRequest();
        userRequest.setUserId(user.getUserId());
        userRequest.setUserName(user.getUserName());
        userRequest.setUserPassword(user.getUserPassword());
        userRequest.setRole(user.getRole());
        return userRequest;
    }

    public User toEntity(UserRequest userRequest) {
        User user = new User();
        user.setUserId(userRequest.getUserId());
        user.setUserName(userRequest.getUserName());
        user.setUserPassword(userRequest.getUserPassword());
        user.setRole(userRequest.getRole());
        return user;
    }
}
