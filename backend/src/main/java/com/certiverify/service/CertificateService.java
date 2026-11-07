package com.certiverify.service;

import com.certiverify.dto.CertificateRequest;
import com.certiverify.dto.CertificateResponse;
import com.certiverify.dto.VerifyResponse;
import com.certiverify.model.Certificate;
import com.certiverify.model.CertificateStatus;
import com.certiverify.model.VerificationLog;
import com.certiverify.repository.CertificateRepository;
import com.certiverify.repository.VerificationLogRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Year;
import java.util.*;

@Service
public class CertificateService {

    private static final Logger logger = LoggerFactory.getLogger(CertificateService.class);

    private final CertificateRepository certificateRepository;
    private final VerificationLogRepository verificationLogRepository;
    private final StorageService storageService;
    private final QrCodeService qrCodeService;
    private final PdfService pdfService;

    @Autowired
    public CertificateService(
            CertificateRepository certificateRepository,
            VerificationLogRepository verificationLogRepository,
            StorageService storageService,
            QrCodeService qrCodeService,
            PdfService pdfService) {
        this.certificateRepository = certificateRepository;
        this.verificationLogRepository = verificationLogRepository;
        this.storageService = storageService;
        this.qrCodeService = qrCodeService;
        this.pdfService = pdfService;
    }

    @Transactional
    public CertificateResponse createCertificate(CertificateRequest req) {
        String certId = req.getCertificateId();
        if (certId == null || certId.trim().isEmpty()) {
            certId = generateCertificateId();
        } else {
            certId = certId.trim().toUpperCase();
            if (certificateRepository.existsById(certId)) {
                throw new IllegalArgumentException("Certificate ID already exists: " + certId);
            }
        }

        Certificate cert = new Certificate();
        cert.setCertificateId(certId);
        cert.setStudentName(req.getStudentName().trim());
        cert.setCourseName(req.getCourseName().trim());
        cert.setOrganisation(req.getOrganisation().trim());
        cert.setIssueDate(req.getIssueDate() != null ? req.getIssueDate() : LocalDate.now());
        cert.setExpiryDate(req.getExpiryDate());
        cert.setGrade(req.getGrade() != null ? req.getGrade().trim() : "Pass with Distinction");

        if (req.getStatus() != null && !req.getStatus().isBlank()) {
            try {
                cert.setStatus(CertificateStatus.valueOf(req.getStatus().trim().toUpperCase()));
            } catch (Exception e) {
                cert.setStatus(CertificateStatus.VERIFIED);
            }
        } else {
            cert.setStatus(CertificateStatus.VERIFIED);
        }
        cert.setRevocationReason(req.getRevocationReason());

        // 1. Generate & store QR code
        String qrUrl = qrCodeService.generateAndStoreCertificateQr(cert.getCertificateId());
        cert.setQrCodeUrl(qrUrl);

        // 2. Generate PDF and store
        try {
            byte[] pdfBytes = pdfService.generateCertificatePdf(cert);
            String pdfKey = storageService.storeFile(pdfBytes, "certificates/cert-" + cert.getCertificateId() + ".pdf", "application/pdf");
            cert.setCertificateUrl(storageService.getFileUrl(pdfKey));
        } catch (Exception e) {
            logger.warn("Could not immediately persist PDF for certificate {}: {}", cert.getCertificateId(), e.getMessage());
        }

        Certificate saved = certificateRepository.save(cert);
        logger.info("Successfully created certificate: {}", saved.getCertificateId());
        return CertificateResponse.fromEntity(saved);
    }

    @Transactional
    public List<CertificateResponse> bulkCreateCertificates(List<CertificateRequest> requests) {
        List<CertificateResponse> responses = new ArrayList<>();
        for (CertificateRequest req : requests) {
            responses.add(createCertificate(req));
        }
        return responses;
    }

    public Page<CertificateResponse> getCertificates(String query, CertificateStatus status, Pageable pageable) {
        Page<Certificate> page = certificateRepository.searchCertificates(query, status, pageable);
        return page.map(CertificateResponse::fromEntity);
    }

    public Optional<CertificateResponse> getCertificateById(String certificateId) {
        return certificateRepository.findById(certificateId).map(CertificateResponse::fromEntity);
    }

    @Transactional
    public VerifyResponse verifyCertificate(String certificateId, String ipAddress, String userAgent) {
        Optional<Certificate> opt = certificateRepository.findById(certificateId.trim());
        if (opt.isEmpty()) {
            // Log failed attempt
            verificationLogRepository.save(new VerificationLog(certificateId, CertificateStatus.INVALID.name(), ipAddress, userAgent));
            return VerifyResponse.invalid(certificateId);
        }

        Certificate cert = opt.get();
        String hash = computeDigitalSignatureHash(cert);

        // Determine effective status
        CertificateStatus effectiveStatus = cert.getStatus();
        if (cert.isExpired()) {
            effectiveStatus = CertificateStatus.EXPIRED;
        }

        // Log verification record
        verificationLogRepository.save(new VerificationLog(certificateId, effectiveStatus.name(), ipAddress, userAgent));
        long totalCount = verificationLogRepository.countByCertificateId(certificateId);

        CertificateResponse responseDto = CertificateResponse.fromEntity(cert);

        if (effectiveStatus == CertificateStatus.REVOKED) {
            return VerifyResponse.revoked(responseDto, hash);
        } else if (effectiveStatus == CertificateStatus.EXPIRED) {
            return VerifyResponse.expired(responseDto, hash);
        } else {
            return VerifyResponse.valid(responseDto, hash, totalCount);
        }
    }

    @Transactional
    public CertificateResponse updateCertificate(String certificateId, CertificateRequest req) {
        Certificate cert = certificateRepository.findById(certificateId)
                .orElseThrow(() -> new NoSuchElementException("Certificate not found with ID: " + certificateId));

        if (req.getStudentName() != null && !req.getStudentName().isBlank()) {
            cert.setStudentName(req.getStudentName().trim());
        }
        if (req.getCourseName() != null && !req.getCourseName().isBlank()) {
            cert.setCourseName(req.getCourseName().trim());
        }
        if (req.getOrganisation() != null && !req.getOrganisation().isBlank()) {
            cert.setOrganisation(req.getOrganisation().trim());
        }
        if (req.getIssueDate() != null) {
            cert.setIssueDate(req.getIssueDate());
        }
        if (req.getExpiryDate() != null) {
            cert.setExpiryDate(req.getExpiryDate());
        }
        if (req.getGrade() != null) {
            cert.setGrade(req.getGrade().trim());
        }
        if (req.getStatus() != null && !req.getStatus().isBlank()) {
            try {
                cert.setStatus(CertificateStatus.valueOf(req.getStatus().trim().toUpperCase()));
            } catch (Exception ignored) {}
        }
        if (req.getRevocationReason() != null) {
            cert.setRevocationReason(req.getRevocationReason());
        }

        cert.setUpdatedAt(LocalDateTime.now());

        // Regenerate PDF
        try {
            byte[] pdfBytes = pdfService.generateCertificatePdf(cert);
            String pdfKey = storageService.storeFile(pdfBytes, "certificates/cert-" + cert.getCertificateId() + ".pdf", "application/pdf");
            cert.setCertificateUrl(storageService.getFileUrl(pdfKey));
        } catch (Exception e) {
            logger.warn("Could not regenerate PDF for certificate {}: {}", cert.getCertificateId(), e.getMessage());
        }

        Certificate saved = certificateRepository.save(cert);
        return CertificateResponse.fromEntity(saved);
    }

    @Transactional
    public CertificateResponse revokeCertificate(String certificateId, String reason) {
        Certificate cert = certificateRepository.findById(certificateId)
                .orElseThrow(() -> new NoSuchElementException("Certificate not found with ID: " + certificateId));

        cert.setStatus(CertificateStatus.REVOKED);
        cert.setRevocationReason(reason != null && !reason.isBlank() ? reason : "Revoked by issuing authority");
        cert.setUpdatedAt(LocalDateTime.now());

        Certificate saved = certificateRepository.save(cert);
        return CertificateResponse.fromEntity(saved);
    }

    @Transactional
    public void deleteCertificate(String certificateId) {
        Certificate cert = certificateRepository.findById(certificateId)
                .orElseThrow(() -> new NoSuchElementException("Certificate not found with ID: " + certificateId));

        storageService.deleteFile("certificates/cert-" + certificateId + ".pdf");
        storageService.deleteFile("qrcodes/qr-" + certificateId + ".png");
        certificateRepository.delete(cert);
    }

    public byte[] downloadCertificatePdf(String certificateId) {
        Certificate cert = certificateRepository.findById(certificateId)
                .orElseThrow(() -> new NoSuchElementException("Certificate not found with ID: " + certificateId));

        return pdfService.generateCertificatePdf(cert);
    }

    public byte[] downloadVerificationReport(String certificateId) {
        Certificate cert = certificateRepository.findById(certificateId)
                .orElseThrow(() -> new NoSuchElementException("Certificate not found with ID: " + certificateId));

        String hash = computeDigitalSignatureHash(cert);
        long count = verificationLogRepository.countByCertificateId(certificateId);
        return pdfService.generateVerificationReportPdf(cert, hash, count);
    }

    public String generateVerificationBadgeSvg(String certificateId) {
        Optional<Certificate> opt = certificateRepository.findById(certificateId);
        String statusText;
        String statusColor;
        String certIdSafe = certificateId;

        if (opt.isEmpty()) {
            statusText = "INVALID";
            statusColor = "#ef4444";
        } else {
            Certificate c = opt.get();
            if (c.getStatus() == CertificateStatus.REVOKED) {
                statusText = "REVOKED";
                statusColor = "#dc2626";
            } else if (c.isExpired()) {
                statusText = "EXPIRED";
                statusColor = "#f59e0b";
            } else {
                statusText = "VERIFIED";
                statusColor = "#10b981";
            }
        }

        return String.format(
                "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"280\" height=\"44\" viewBox=\"0 0 280 44\" fill=\"none\">" +
                "<rect width=\"280\" height=\"44\" rx=\"8\" fill=\"#1e293b\"/>" +
                "<rect x=\"2\" y=\"2\" width=\"276\" height=\"40\" rx=\"6\" fill=\"#0f172a\" stroke=\"#334155\" stroke-width=\"1\"/>" +
                "<circle cx=\"24\" cy=\"22\" r=\"10\" fill=\"%s\" fill-opacity=\"0.2\"/>" +
                "<circle cx=\"24\" cy=\"22\" r=\"5\" fill=\"%s\"/>" +
                "<text fill=\"#94a3b8\" font-family=\"ui-sans-serif, system-ui, sans-serif\" font-size=\"10\" font-weight=\"600\" x=\"44\" y=\"18\">CERTIVERIFY CLOUD</text>" +
                "<text fill=\"#ffffff\" font-family=\"ui-sans-serif, system-ui, sans-serif\" font-size=\"11\" font-weight=\"700\" x=\"44\" y=\"32\">%s</text>" +
                "<rect x=\"180\" y=\"10\" width=\"88\" height=\"24\" rx=\"4\" fill=\"%s\" fill-opacity=\"0.15\" stroke=\"%s\" stroke-width=\"1\"/>" +
                "<text fill=\"%s\" font-family=\"ui-sans-serif, system-ui, sans-serif\" font-size=\"11\" font-weight=\"700\" x=\"224\" y=\"26\" text-anchor=\"middle\">%s</text>" +
                "</svg>",
                statusColor, statusColor, certIdSafe, statusColor, statusColor, statusColor, statusText
        );
    }

    private String generateCertificateId() {
        int year = Year.now().getValue();
        String randomSuffix = UUID.randomUUID().toString().replace("-", "").substring(0, 8).toUpperCase();
        return "CV-" + year + "-" + randomSuffix;
    }

    public String computeDigitalSignatureHash(Certificate cert) {
        try {
            String raw = cert.getCertificateId() + "|" + cert.getStudentName() + "|" + cert.getCourseName() + "|" +
                    cert.getOrganisation() + "|" + cert.getIssueDate() + "|" + cert.getStatus();
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hashBytes = digest.digest(raw.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder("SHA256:");
            for (byte b : hashBytes) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (Exception e) {
            return "SHA256:VERIFIED-HASH-" + cert.getCertificateId();
        }
    }
}

