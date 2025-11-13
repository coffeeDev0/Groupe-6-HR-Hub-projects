package com.erpproject.employer_service.secutity;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;


@Component
public class PasswordUtils {

    private static final PasswordEncoder ENCODER = new BCryptPasswordEncoder(12);

    // Hasher
    public static String hashPassword(String plainPassword) {
        return ENCODER.encode(plainPassword);
    }

    // Vérifier
    public static boolean verifyPassword(String plainPassword, String hashed) {
        return ENCODER.matches(plainPassword, hashed);
    }

}
