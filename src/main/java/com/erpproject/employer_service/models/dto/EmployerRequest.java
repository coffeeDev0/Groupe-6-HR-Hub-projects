package com.erpproject.employer_service.models.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class EmployerRequest {
    @NotNull
    private String userName;
    @NotNull
    private String userPassword;
    @NotNull
    private String rhId;

}