package com.certiverify.repository;

import com.certiverify.model.Certificate;
import com.certiverify.model.CertificateStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CertificateRepository extends JpaRepository<Certificate, String> {

    List<Certificate> findAllByOrderByCreatedAtDesc();

    Page<Certificate> findAllByOrderByCreatedAtDesc(Pageable pageable);

    long countByStatus(CertificateStatus status);

    @Query("SELECT c FROM Certificate c WHERE " +
           "(:query IS NULL OR :query = '' OR " +
           "LOWER(c.certificateId) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(c.studentName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(c.courseName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(c.organisation) LIKE LOWER(CONCAT('%', :query, '%'))) AND " +
           "(:status IS NULL OR c.status = :status) " +
           "ORDER BY c.createdAt DESC")
    Page<Certificate> searchCertificates(
            @Param("query") String query,
            @Param("status") CertificateStatus status,
            Pageable pageable
    );

    @Query("SELECT c.status, COUNT(c) FROM Certificate c GROUP BY c.status")
    List<Object[]> getStatusCounts();

    @Query("SELECT FUNCTION('TO_CHAR', c.issueDate, 'YYYY-MM') as month, COUNT(c) " +
           "FROM Certificate c GROUP BY FUNCTION('TO_CHAR', c.issueDate, 'YYYY-MM') " +
           "ORDER BY month ASC")
    List<Object[]> getMonthlyIssuanceCounts();
}
