package com.certiverify;

import com.certiverify.dto.CertificateRequest;
import com.certiverify.dto.CertificateResponse;
import com.certiverify.dto.VerifyResponse;
import com.certiverify.model.CertificateStatus;
import com.certiverify.service.CertificateService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
public class CertificateServiceTest {

    @Autowired
    private CertificateService certificateService;

    @Test
    @DisplayName("Should successfully issue a new certificate with QR code and PDF")
    void testIssueCertificate() {
        CertificateRequest req = new CertificateRequest();
        req.setStudentName("Test Student");
        req.setCourseName("Advanced Distributed Systems");
        req.setOrganisation("Test University");
        req.setIssueDate(LocalDate.now());
        req.setExpiryDate(LocalDate.now().plusYears(2));
        req.setGrade("Honors");

        CertificateResponse res = certificateService.createCertificate(req);

        assertNotNull(res);
        assertNotNull(res.getCertificateId());
        assertTrue(res.getCertificateId().startsWith("CV-"));
        assertEquals("Test Student", res.getStudentName());
        assertEquals(CertificateStatus.VERIFIED, res.getStatus());
        assertNotNull(res.getQrCodeUrl());
    }

    @Test
    @DisplayName("Should verify valid certificate and return SHA-256 fingerprint")
    void testVerifyValidCertificate() {
        CertificateRequest req = new CertificateRequest();
        req.setCertificateId("CV-TEST-VERIFY01");
        req.setStudentName("Alice Smith");
        req.setCourseName("Information Security");
        req.setOrganisation("Security Academy");
        req.setIssueDate(LocalDate.now());

        certificateService.createCertificate(req);

        VerifyResponse verify = certificateService.verifyCertificate("CV-TEST-VERIFY01", "127.0.0.1", "JUnit-Test");

        assertNotNull(verify);
        assertTrue(verify.isValid());
        assertEquals(CertificateStatus.VERIFIED, verify.getStatus());
        assertNotNull(verify.getDigitalSignatureHash());
        assertTrue(verify.getDigitalSignatureHash().startsWith("SHA256:"));
    }

    @Test
    @DisplayName("Should correctly identify and report revoked certificates")
    void testRevokeCertificate() {
        CertificateRequest req = new CertificateRequest();
        req.setCertificateId("CV-TEST-REVOKE01");
        req.setStudentName("Bob Johnson");
        req.setCourseName("Data Science");
        req.setOrganisation("Data Guild");
        req.setIssueDate(LocalDate.now());

        certificateService.createCertificate(req);
        certificateService.revokeCertificate("CV-TEST-REVOKE01", "Honor code violation");

        VerifyResponse verify = certificateService.verifyCertificate("CV-TEST-REVOKE01", "127.0.0.1", "JUnit-Test");

        assertNotNull(verify);
        assertFalse(verify.isValid());
        assertEquals(CertificateStatus.REVOKED, verify.getStatus());
        assertTrue(verify.getMessage().contains("REVOKED"));
    }

    @Test
    @DisplayName("Should return invalid status for non-existent certificate ID")
    void testVerifyNonExistentCertificate() {
        VerifyResponse verify = certificateService.verifyCertificate("CV-NON-EXISTENT", "127.0.0.1", "JUnit-Test");

        assertNotNull(verify);
        assertFalse(verify.isValid());
        assertEquals(CertificateStatus.INVALID, verify.getStatus());
    }
}

