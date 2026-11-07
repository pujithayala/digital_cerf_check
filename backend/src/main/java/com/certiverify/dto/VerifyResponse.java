package com.certiverify.dto;

import com.certiverify.model.CertificateStatus;

import java.time.LocalDateTime;

public class VerifyResponse {
    private boolean valid;
    private CertificateStatus status;
    private String message;
    private CertificateResponse certificate;
    private LocalDateTime verifiedAt;
    private String digitalSignatureHash;
    private long totalVerifications;

    public VerifyResponse() {
        this.verifiedAt = LocalDateTime.now();
    }

    public static VerifyResponse valid(CertificateResponse cert, String hash, long count) {
        VerifyResponse res = new VerifyResponse();
        res.setValid(true);
        res.setStatus(cert.getStatus());
        res.setMessage("Digital Certificate is verified, valid, and authentic in the CertiVerify Cloud Database.");
        res.setCertificate(cert);
        res.setDigitalSignatureHash(hash);
        res.setTotalVerifications(count);
        return res;
    }

    public static VerifyResponse revoked(CertificateResponse cert, String hash) {
        VerifyResponse res = new VerifyResponse();
        res.setValid(false);
        res.setStatus(CertificateStatus.REVOKED);
        res.setMessage("This certificate has been REVOKED by " + cert.getOrganisation() + 
                (cert.getRevocationReason() != null ? ": " + cert.getRevocationReason() : "."));
        res.setCertificate(cert);
        res.setDigitalSignatureHash(hash);
        return res;
    }

    public static VerifyResponse expired(CertificateResponse cert, String hash) {
        VerifyResponse res = new VerifyResponse();
        res.setValid(false);
        res.setStatus(CertificateStatus.EXPIRED);
        res.setMessage("This certificate expired on " + cert.getExpiryDate() + " and is no longer active.");
        res.setCertificate(cert);
        res.setDigitalSignatureHash(hash);
        return res;
    }

    public static VerifyResponse invalid(String certificateId) {
        VerifyResponse res = new VerifyResponse();
        res.setValid(false);
        res.setStatus(CertificateStatus.INVALID);
        res.setMessage("No matching certificate record found for ID: " + certificateId + ". The certificate may be fraudulent or invalid.");
        return res;
    }

    public boolean isValid() {
        return valid;
    }

    public void setValid(boolean valid) {
        this.valid = valid;
    }

    public CertificateStatus getStatus() {
        return status;
    }

    public void setStatus(CertificateStatus status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public CertificateResponse getCertificate() {
        return certificate;
    }

    public void setCertificate(CertificateResponse certificate) {
        this.certificate = certificate;
    }

    public LocalDateTime getVerifiedAt() {
        return verifiedAt;
    }

    public void setVerifiedAt(LocalDateTime verifiedAt) {
        this.verifiedAt = verifiedAt;
    }

    public String getDigitalSignatureHash() {
        return digitalSignatureHash;
    }

    public void setDigitalSignatureHash(String digitalSignatureHash) {
        this.digitalSignatureHash = digitalSignatureHash;
    }

    public long getTotalVerifications() {
        return totalVerifications;
    }

    public void setTotalVerifications(long totalVerifications) {
        this.totalVerifications = totalVerifications;
    }
}
