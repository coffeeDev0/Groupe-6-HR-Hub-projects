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
}
