package com.certiverify.dto;

import com.certiverify.model.Certificate;
import com.certiverify.model.CertificateStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class CertificateResponse {
    private String certificateId;
    private String studentName;
    private String courseName;
    private String organisation;
    private LocalDate issueDate;
    private LocalDate expiryDate;
    private String certificateUrl;
    private String qrCodeUrl;
    private CertificateStatus status;
    private String revocationReason;
    private String grade;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private boolean isExpired;

    public CertificateResponse() {
    }

    public static CertificateResponse fromEntity(Certificate cert) {
        CertificateResponse res = new CertificateResponse();
        res.setCertificateId(cert.getCertificateId());
        res.setStudentName(cert.getStudentName());
        res.setCourseName(cert.getCourseName());
        res.setOrganisation(cert.getOrganisation());
        res.setIssueDate(cert.getIssueDate());
        res.setExpiryDate(cert.getExpiryDate());
        res.setCertificateUrl(cert.getCertificateUrl());
        res.setQrCodeUrl(cert.getQrCodeUrl());
        res.setStatus(cert.getStatus());
        res.setRevocationReason(cert.getRevocationReason());
        res.setGrade(cert.getGrade());
        res.setCreatedAt(cert.getCreatedAt());
        res.setUpdatedAt(cert.getUpdatedAt());
        res.setExpired(cert.isExpired());
        return res;
    }

    public String getCertificateId() {
        return certificateId;
    }

    public void setCertificateId(String certificateId) {
        this.certificateId = certificateId;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public String getCourseName() {
        return courseName;
    }

    public void setCourseName(String courseName) {
        this.courseName = courseName;
    }

    public String getOrganisation() {
        return organisation;
    }

    public void setOrganisation(String organisation) {
        this.organisation = organisation;
    }

    public LocalDate getIssueDate() {
        return issueDate;
    }

    public void setIssueDate(LocalDate issueDate) {
        this.issueDate = issueDate;
    }

    public LocalDate getExpiryDate() {
        return expiryDate;
    }

    public void setExpiryDate(LocalDate expiryDate) {
        this.expiryDate = expiryDate;
    }

    public String getCertificateUrl() {
        return certificateUrl;
    }

    public void setCertificateUrl(String certificateUrl) {
        this.certificateUrl = certificateUrl;
    }

    public String getQrCodeUrl() {
        return qrCodeUrl;
    }

    public void setQrCodeUrl(String qrCodeUrl) {
        this.qrCodeUrl = qrCodeUrl;
    }

    public CertificateStatus getStatus() {
        return status;
    }

    public void setStatus(CertificateStatus status) {
        this.status = status;
    }

    public String getRevocationReason() {
        return revocationReason;
    }

    public void setRevocationReason(String revocationReason) {
        this.revocationReason = revocationReason;
    }

    public String getGrade() {
        return grade;
    }

    public void setGrade(String grade) {
        this.grade = grade;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public boolean isExpired() {
        return isExpired;
    }

    public void setExpired(boolean expired) {
        isExpired = expired;
    }
}
