package com.certiverify.controller;

import com.certiverify.dto.ApiResponse;
import com.certiverify.dto.StatsResponse;
import com.certiverify.model.VerificationLog;
import com.certiverify.service.StatsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/stats")
public class StatsController {

    private final StatsService statsService;

    @Autowired
    public StatsController(StatsService statsService) {
        this.statsService = statsService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<StatsResponse>> getStats() {
        StatsResponse stats = statsService.getDashboardStats();
        return ResponseEntity.ok(ApiResponse.success("Statistics retrieved successfully", stats));
    }

    @GetMapping("/public")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getPublicStats() {
        StatsResponse stats = statsService.getDashboardStats();
        Map<String, Object> publicData = new HashMap<>();
        publicData.put("totalCertificates", stats.getTotalCertificates());
        publicData.put("verifiedCertificates", stats.getVerifiedCertificates());
        publicData.put("totalVerifications", stats.getTotalVerifications());
        return ResponseEntity.ok(ApiResponse.success("Public verification metrics", publicData));
    }

    @GetMapping("/audit-logs")
    public ResponseEntity<ApiResponse<List<VerificationLog>>> getAuditLogs() {
        return ResponseEntity.ok(ApiResponse.success("Audit logs retrieved", statsService.getRecentAuditLogs()));
    }
}
