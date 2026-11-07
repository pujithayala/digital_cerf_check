package com.certiverify.repository;

import com.certiverify.model.VerificationLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VerificationLogRepository extends JpaRepository<VerificationLog, Long> {
    List<VerificationLog> findTop10ByOrderByVerifiedAtDesc();
    long countByCertificateId(String certificateId);
}
