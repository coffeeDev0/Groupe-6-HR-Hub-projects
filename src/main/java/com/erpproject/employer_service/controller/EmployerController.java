package com.erpproject.employer_service.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import com.erpproject.employer_service.communication.NotificationService;
import com.erpproject.employer_service.mapper.EmployerMapper;
import com.erpproject.employer_service.models.Employer;
import com.erpproject.employer_service.models.dto.EmployerRequest;
import com.erpproject.employer_service.models.dto.EmployerResult;
import com.erpproject.employer_service.services.EmployerService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Validated
@RequiredArgsConstructor
@RestController
@RequestMapping("/employer")
public class EmployerController {

    private final EmployerService employerService;
    private final EmployerMapper employerMapper;
    private final NotificationService notificationService;
    
    @PostMapping("/add")
    public ResponseEntity<EmployerResult> addEmployer(@Valid @RequestBody EmployerRequest employerRequest) {
        try {
            EmployerResult newEmployer = employerService.createAndNotifyEmployer(employerRequest);
            notificationService.notifyNewEmployer(newEmployer);
            return ResponseEntity.ok(newEmployer);
        } catch (IllegalArgumentException e) {
            log.warn("Invalid employer data: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        } catch (Exception e) {
            log.error("Error creating employer", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<EmployerResult>> getEmployers() {
        List<Employer> employers = employerService.findAllEmployer();
        List<EmployerResult> employerResults = employers.stream()
            .map(employerMapper::toDto)
            .toList();
        return ResponseEntity.ok(employerResults);
    }
}
