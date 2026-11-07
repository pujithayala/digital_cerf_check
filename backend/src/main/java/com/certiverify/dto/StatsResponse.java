package com.certiverify.dto;

import java.util.List;
import java.util.Map;

public class StatsResponse {
    private long totalCertificates;
    private long verifiedCertificates;
    private long revokedCertificates;
    private long expiredCertificates;
    private long totalVerifications;
    private Map<String, Long> statusDistribution;
    private List<MonthlyTrend> monthlyTrends;

    public static class MonthlyTrend {
        private String month;
        private long count;

        public MonthlyTrend() {}
        public MonthlyTrend(String month, long count) {
            this.month = month;
            this.count = count;
        }

        public String getMonth() { return month; }
        public void setMonth(String month) { this.month = month; }
        public long getCount() { return count; }
        public void setCount(long count) { this.count = count; }
    }

    public StatsResponse() {
    }

    public long getTotalCertificates() {
        return totalCertificates;
    }

    public void setTotalCertificates(long totalCertificates) {
        this.totalCertificates = totalCertificates;
    }

    public long getVerifiedCertificates() {
        return verifiedCertificates;
    }

    public void setVerifiedCertificates(long verifiedCertificates) {
        this.verifiedCertificates = verifiedCertificates;
    }

    public long getRevokedCertificates() {
        return revokedCertificates;
    }

    public void setRevokedCertificates(long revokedCertificates) {
        this.revokedCertificates = revokedCertificates;
    }

    public long getExpiredCertificates() {
        return expiredCertificates;
    }

    public void setExpiredCertificates(long expiredCertificates) {
        this.expiredCertificates = expiredCertificates;
    }

    public long getTotalVerifications() {
        return totalVerifications;
    }

    public void setTotalVerifications(long totalVerifications) {
        this.totalVerifications = totalVerifications;
    }

    public Map<String, Long> getStatusDistribution() {
        return statusDistribution;
    }

    public void setStatusDistribution(Map<String, Long> statusDistribution) {
        this.statusDistribution = statusDistribution;
    }

    public List<MonthlyTrend> getMonthlyTrends() {
        return monthlyTrends;
    }

    public void setMonthlyTrends(List<MonthlyTrend> monthlyTrends) {
        this.monthlyTrends = monthlyTrends;
    }
}
