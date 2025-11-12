package com.erpproject.employer_service.models.dto;

import java.util.UUID;

import lombok.Data;

@Data
public class EmployerResult {
    private UUID userId;
    private String userName;
    private String userPassword;
    private UUID rhId;
    private String role;


}