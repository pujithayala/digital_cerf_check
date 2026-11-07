package com.certiverify.service;

import com.certiverify.dto.StatsResponse;
import com.certiverify.model.CertificateStatus;
import com.certiverify.model.VerificationLog;
import com.certiverify.repository.CertificateRepository;
import com.certiverify.repository.VerificationLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class StatsService {

    private final CertificateRepository certificateRepository;
    private final VerificationLogRepository verificationLogRepository;

    @Autowired
    public StatsService(CertificateRepository certificateRepository, VerificationLogRepository verificationLogRepository) {
        this.certificateRepository = certificateRepository;
        this.verificationLogRepository = verificationLogRepository;
    }

    public StatsResponse getDashboardStats() {
        StatsResponse stats = new StatsResponse();

        long total = certificateRepository.count();
        long verified = certificateRepository.countByStatus(CertificateStatus.VERIFIED);
        long revoked = certificateRepository.countByStatus(CertificateStatus.REVOKED);
        long expired = certificateRepository.countByStatus(CertificateStatus.EXPIRED);
        long verifications = verificationLogRepository.count();

        stats.setTotalCertificates(total);
        stats.setVerifiedCertificates(verified);
        stats.setRevokedCertificates(revoked);
        stats.setExpiredCertificates(expired);
        stats.setTotalVerifications(verifications);

        Map<String, Long> distribution = new LinkedHashMap<>();
        distribution.put("VERIFIED", verified);
        distribution.put("REVOKED", revoked);
        distribution.put("EXPIRED", expired);
        stats.setStatusDistribution(distribution);

        List<StatsResponse.MonthlyTrend> trends = new ArrayList<>();
        try {
            List<Object[]> rawTrends = certificateRepository.getMonthlyIssuanceCounts();
            if (rawTrends != null && !rawTrends.isEmpty()) {
                for (Object[] row : rawTrends) {
                    if (row.length >= 2 && row[0] != null) {
                        String month = String.valueOf(row[0]);
                        long count = ((Number) row[1]).longValue();
                        trends.add(new StatsResponse.MonthlyTrend(month, count));
                    }
                }
            }
        } catch (Exception ignored) {
            // Fallback for DB engines where custom function differs
        }

        if (trends.isEmpty()) {
            trends.add(new StatsResponse.MonthlyTrend("Recent", total));
        }

        stats.setMonthlyTrends(trends);
        return stats;
    }

    public List<VerificationLog> getRecentAuditLogs() {
        return verificationLogRepository.findTop10ByOrderByVerifiedAtDesc();
    }
}
