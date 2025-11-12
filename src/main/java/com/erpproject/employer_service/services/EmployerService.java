package com.erpproject.employer_service.services;

import java.util.List;
import java.util.Optional;

import com.erpproject.employer_service.models.Employer;
import com.erpproject.employer_service.models.dto.EmployerRequest;
import com.erpproject.employer_service.models.dto.EmployerResult;

public interface EmployerService {
    
    /**
     * Crée un nouvel employé, l'enregistre et notifie le service de congé.
     * @param employerRequest Le DTO contenant les informations de l'employé à créer.
     * @return L'entité Employer créée et persistée.
     * @throws Exception en cas d'erreur de persistance ou d'appel au service externe.
     */
    EmployerResult createAndNotifyEmployer(EmployerRequest employerRequest) throws Exception;
    List<Employer> findAllEmployer();
}