package com.erpproject.employer_service.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;

import com.erpproject.employer_service.models.dto.EmployerRequest;
import com.erpproject.employer_service.models.dto.RhResult;
import com.erpproject.employer_service.services.RhService;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequiredArgsConstructor
@RequestMapping("/rh")
public class RhController {
    
    private final RhService rhService;

    @PostMapping("/add")
    public ResponseEntity<RhResult> createRh(@RequestBody EmployerRequest rh) {
        
        RhResult createdRh = rhService.createRh(rh);
        return ResponseEntity.ok(createdRh);
    }

    @GetMapping("/all")
    public ResponseEntity<List<RhResult>> findAllRh() {
        List<RhResult> rhResults = rhService.findAllRh();
        return ResponseEntity.ok(rhResults);
    }
    
}
