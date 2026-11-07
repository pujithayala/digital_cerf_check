package com.certiverify.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "verification_logs")
public class VerificationLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "certificate_id", nullable = false, length = 100)
    private String certificateId;

    @Column(name = "verified_at")
    private LocalDateTime verifiedAt = LocalDateTime.now();

    @Column(name = "status_at_verification", length = 50)
    private String statusAtVerification;

    @Column(name = "ip_address", length = 100)
    private String ipAddress;

    @Column(name = "user_agent", length = 300)
    private String userAgent;

    public VerificationLog() {
    }

    public VerificationLog(String certificateId, String statusAtVerification, String ipAddress, String userAgent) {
        this.certificateId = certificateId;
        this.statusAtVerification = statusAtVerification;
        this.ipAddress = ipAddress;
        this.userAgent = userAgent;
        this.verifiedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCertificateId() {
        return certificateId;
    }

    public void setCertificateId(String certificateId) {
        this.certificateId = certificateId;
    }

    public LocalDateTime getVerifiedAt() {
        return verifiedAt;
    }

    public void setVerifiedAt(LocalDateTime verifiedAt) {
        this.verifiedAt = verifiedAt;
    }

    public String getStatusAtVerification() {
        return statusAtVerification;
    }

    public void setStatusAtVerification(String statusAtVerification) {
        this.statusAtVerification = statusAtVerification;
    }

    public String getIpAddress() {
        return ipAddress;
    }

    public void setIpAddress(String ipAddress) {
        this.ipAddress = ipAddress;
    }

    public String getUserAgent() {
        return userAgent;
    }

    public void setUserAgent(String userAgent) {
        this.userAgent = userAgent;
    }
}
