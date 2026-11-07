package com.certiverify.controller;

import com.certiverify.dto.ApiResponse;
import com.certiverify.dto.AuthRequest;
import com.certiverify.dto.AuthResponse;
import com.certiverify.model.Admin;
import com.certiverify.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    @Autowired
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody AuthRequest request) {
        try {
            AuthResponse response = authService.login(request);
            return ResponseEntity.ok(ApiResponse.success("Authentication successful", response));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getCurrentUser(@AuthenticationPrincipal String username) {
        if (username == null) {
            return ResponseEntity.status(401).body(ApiResponse.error("Not authenticated"));
        }

        Optional<Admin> adminOpt = authService.findByUsername(username);
        if (adminOpt.isEmpty()) {
            return ResponseEntity.status(404).body(ApiResponse.error("Admin user not found"));
        }

        Admin admin = adminOpt.get();
        Map<String, Object> data = new HashMap<>();
        data.put("adminId", admin.getAdminId());
        data.put("username", admin.getUsername());
        data.put("email", admin.getEmail());
        data.put("role", admin.getRole());

        return ResponseEntity.ok(ApiResponse.success("Authenticated user details", data));
    }
}

