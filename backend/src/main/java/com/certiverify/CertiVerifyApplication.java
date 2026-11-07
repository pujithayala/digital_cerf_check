package com.certiverify;

import com.certiverify.dto.CertificateRequest;
import com.certiverify.model.Admin;
import com.certiverify.repository.AdminRepository;
import com.certiverify.repository.CertificateRepository;
import com.certiverify.service.CertificateService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;

@SpringBootApplication
public class CertiVerifyApplication {

    private static final Logger logger = LoggerFactory.getLogger(CertiVerifyApplication.class);

    public static void main(String[] args) {
        SpringApplication.run(CertiVerifyApplication.class, args);
    }

    @Bean
    public CommandLineRunner initDatabase(
            AdminRepository adminRepository,
            CertificateRepository certificateRepository,
            CertificateService certificateService,
            PasswordEncoder passwordEncoder) {
        return args -> {
            // 1. Seed Admin user if not exists
            if (!adminRepository.existsByUsername("admin")) {
                Admin admin = new Admin();
                admin.setUsername("admin");
                admin.setEmail("admin@certiverify.com");
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setRole("ROLE_ADMIN");
                adminRepository.save(admin);
                logger.info("Initialized default administrator account: username 'admin' (password: admin123)");
            }

            // 2. Seed initial demo certificates if database is empty
            if (certificateRepository.count() == 0) {
                logger.info("Seeding demo certificates with realistic data...");

                // Demo 1: Active Verified Certificate
                CertificateRequest c1 = new CertificateRequest();
                c1.setCertificateId("CV-2026-CLOUD01");
                c1.setStudentName("Sarah Jenkins");
                c1.setCourseName("AWS Certified Solutions Architect & Cloud Security");
                c1.setOrganisation("CertiVerify Institute of Technology");
                c1.setIssueDate(LocalDate.now().minusMonths(2));
                c1.setExpiryDate(LocalDate.now().plusYears(3));
                c1.setGrade("Grade A - Top 5% Honors");
                c1.setStatus("VERIFIED");
                certificateService.createCertificate(c1);

                // Demo 2: Another Active Certificate
                CertificateRequest c2 = new CertificateRequest();
                c2.setCertificateId("CV-2026-AI8899");
                c2.setStudentName("Alexander Zhao");
                c2.setCourseName("Deep Learning & Agentic Systems Engineering");
                c2.setOrganisation("Global AI Standards Council");
                c2.setIssueDate(LocalDate.now().minusDays(15));
                c2.setExpiryDate(LocalDate.now().plusYears(2));
                c2.setGrade("First Class Distinction");
                c2.setStatus("VERIFIED");
                certificateService.createCertificate(c2);

                // Demo 3: Revoked Certificate
                CertificateRequest c3 = new CertificateRequest();
                c3.setCertificateId("CV-2025-REVOKED9");
                c3.setStudentName("Marcus Vance");
                c3.setCourseName("Executive Cybersecurity Leadership");
                c3.setOrganisation("CyberDefense Institute");
                c3.setIssueDate(LocalDate.now().minusMonths(8));
                c3.setExpiryDate(LocalDate.now().plusYears(1));
                c3.setStatus("REVOKED");
                c3.setRevocationReason("Revoked following formal credential audit & honor code investigation.");
                certificateService.createCertificate(c3);

                // Demo 4: Expired Certificate
                CertificateRequest c4 = new CertificateRequest();
                c4.setCertificateId("CV-2024-EXP404");
                c4.setStudentName("Elena Rostova");
                c4.setCourseName("Agile Scrum Master Professional");
                c4.setOrganisation("Scrum Alliance Partner Network");
                c4.setIssueDate(LocalDate.of(2023, 1, 15));
                c4.setExpiryDate(LocalDate.of(2024, 1, 15)); // Expired in 2024
                c4.setGrade("Pass");
                c4.setStatus("VERIFIED"); // marked verified when issued, but date expired
                certificateService.createCertificate(c4);

                logger.info("Successfully seeded 4 demo certificates (Verified, Revoked, Expired).");
            }
        };
    }
}

