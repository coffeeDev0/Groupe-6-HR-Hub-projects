package com.erpproject.employer_service.services;

import com.erpproject.employer_service.models.Roles;
import com.erpproject.employer_service.models.User;

public interface AdminService {

    public String attributRole(User user, Roles role);

    public void createAdmin();
}
