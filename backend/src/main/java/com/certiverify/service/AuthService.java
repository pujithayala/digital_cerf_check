package com.certiverify.service;

import com.certiverify.config.JwtUtils;
import com.certiverify.dto.AuthRequest;
import com.certiverify.dto.AuthResponse;
import com.certiverify.model.Admin;
import com.certiverify.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    @Autowired
    public AuthService(AdminRepository adminRepository, PasswordEncoder passwordEncoder, JwtUtils jwtUtils) {
        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
    }

    public AuthResponse login(AuthRequest request) {
        String identifier = request.getUsername().trim();
        Optional<Admin> adminOpt = adminRepository.findByUsername(identifier);
        if (adminOpt.isEmpty()) {
            adminOpt = adminRepository.findByEmail(identifier);
        }

        if (adminOpt.isEmpty()) {
            throw new BadCredentialsException("Invalid username or password");
        }

        Admin admin = adminOpt.get();
        if (!passwordEncoder.matches(request.getPassword(), admin.getPassword())) {
            throw new BadCredentialsException("Invalid username or password");
        }

        String token = jwtUtils.generateToken(admin.getUsername(), admin.getRole());
        return new AuthResponse(
                token,
                admin.getAdminId(),
                admin.getUsername(),
                admin.getEmail(),
                admin.getRole()
        );
    }

    public Optional<Admin> findByUsername(String username) {
        return adminRepository.findByUsername(username);
    }
}

