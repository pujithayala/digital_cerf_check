package com.certiverify.controller;

import com.certiverify.dto.ApiResponse;
import com.certiverify.dto.CertificateRequest;
import com.certiverify.dto.CertificateResponse;
import com.certiverify.dto.VerifyResponse;
import com.certiverify.model.CertificateStatus;
import com.certiverify.service.CertificateService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/certificates")
public class CertificateController {

    private final CertificateService certificateService;

    @Autowired
    public CertificateController(CertificateService certificateService) {
        this.certificateService = certificateService;
    }

    // 1. Public Verification Endpoint
    @GetMapping("/verify/{certificateId}")
    public ResponseEntity<ApiResponse<VerifyResponse>> verifyCertificate(
            @PathVariable String certificateId,
            HttpServletRequest request) {

        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.isBlank()) {
            ip = request.getRemoteAddr();
        }
        String userAgent = request.getHeader("User-Agent");

        VerifyResponse response = certificateService.verifyCertificate(certificateId, ip, userAgent);
        return ResponseEntity.ok(ApiResponse.success(response.getMessage(), response));
    }

    // 2. Public Certificate Details Endpoint
    @GetMapping("/{certificateId}")
    public ResponseEntity<ApiResponse<CertificateResponse>> getCertificate(@PathVariable String certificateId) {
        return certificateService.getCertificateById(certificateId)
                .map(cert -> ResponseEntity.ok(ApiResponse.success("Certificate details retrieved", cert)))
                .orElseGet(() -> ResponseEntity.status(404).body(ApiResponse.error("Certificate not found with ID: " + certificateId)));
    }

    // 3. Public Download PDF Endpoint
    @GetMapping("/{certificateId}/download")
    public ResponseEntity<byte[]> downloadCertificate(@PathVariable String certificateId) {
        try {
            byte[] pdfBytes = certificateService.downloadCertificatePdf(certificateId);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"certificate-" + certificateId + ".pdf\"")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(pdfBytes);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    // 4. Public Download Verification Report PDF
    @GetMapping("/{certificateId}/verification-report")
    public ResponseEntity<byte[]> downloadVerificationReport(@PathVariable String certificateId) {
        try {
            byte[] reportBytes = certificateService.downloadVerificationReport(certificateId);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"verification-audit-" + certificateId + ".pdf\"")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(reportBytes);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    // 5. Public Dynamic Verification Badge SVG
    @GetMapping(value = "/{certificateId}/verification-badge", produces = "image/svg+xml")
    public ResponseEntity<String> getVerificationBadge(@PathVariable String certificateId) {
        String svg = certificateService.generateVerificationBadgeSvg(certificateId);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_TYPE, "image/svg+xml;charset=UTF-8")
                .header(HttpHeaders.CACHE_CONTROL, "no-cache, no-store, must-revalidate")
                .body(svg);
    }

    // 6. Admin Search & List Certificates (protected)
    @GetMapping
    public ResponseEntity<ApiResponse<Page<CertificateResponse>>> listCertificates(
            @RequestParam(required = false, defaultValue = "") String query,
            @RequestParam(required = false) CertificateStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {

        Sort sort = direction.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<CertificateResponse> certificates = certificateService.getCertificates(query, status, pageable);
        return ResponseEntity.ok(ApiResponse.success("Certificates retrieved successfully", certificates));
    }

    // 7. Admin Create Certificate (protected)
    @PostMapping
    public ResponseEntity<ApiResponse<CertificateResponse>> createCertificate(@Valid @RequestBody CertificateRequest req) {
        try {
            CertificateResponse created = certificateService.createCertificate(req);
            return ResponseEntity.status(201).body(ApiResponse.success("Certificate issued successfully", created));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(ApiResponse.error("Failed to issue certificate: " + e.getMessage()));
        }
    }

    // 8. Admin Bulk Create (protected)
    @PostMapping("/bulk")
    public ResponseEntity<ApiResponse<List<CertificateResponse>>> bulkCreateCertificates(@Valid @RequestBody List<CertificateRequest> requests) {
        try {
            List<CertificateResponse> created = certificateService.bulkCreateCertificates(requests);
            return ResponseEntity.status(201).body(ApiResponse.success("Successfully bulk-issued " + created.size() + " certificates", created));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Bulk issuance failed: " + e.getMessage()));
        }
    }

    // 9. Admin Update Certificate (protected)
    @PutMapping("/{certificateId}")
    public ResponseEntity<ApiResponse<CertificateResponse>> updateCertificate(
            @PathVariable String certificateId,
            @RequestBody CertificateRequest req) {
        try {
            CertificateResponse updated = certificateService.updateCertificate(certificateId, req);
            return ResponseEntity.ok(ApiResponse.success("Certificate updated successfully", updated));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Update failed: " + e.getMessage()));
        }
    }

    // 10. Admin Revoke Certificate (protected)
    @PostMapping("/{certificateId}/revoke")
    public ResponseEntity<ApiResponse<CertificateResponse>> revokeCertificate(
            @PathVariable String certificateId,
            @RequestBody(required = false) Map<String, String> body) {
        try {
            String reason = body != null ? body.get("reason") : "Revoked by administrator";
            CertificateResponse revoked = certificateService.revokeCertificate(certificateId, reason);
            return ResponseEntity.ok(ApiResponse.success("Certificate revoked successfully", revoked));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Revocation failed: " + e.getMessage()));
        }
    }

    // 11. Admin Delete Certificate (protected)
    @DeleteMapping("/{certificateId}")
    public ResponseEntity<ApiResponse<Void>> deleteCertificate(@PathVariable String certificateId) {
        try {
            certificateService.deleteCertificate(certificateId);
            return ResponseEntity.ok(ApiResponse.success("Certificate deleted successfully", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Delete failed: " + e.getMessage()));
        }
    }
}

