package com.certiverify.service;

import com.certiverify.model.Certificate;
import com.certiverify.model.CertificateStatus;
import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class PdfService {

    private static final Logger logger = LoggerFactory.getLogger(PdfService.class);

    private final QrCodeService qrCodeService;

    // Pinkish-blue palette matching requirement
    private static final Color PRIMARY_BLUE = new Color(0xA9, 0xC9, 0xF5);
    private static final Color SOFT_PINK = new Color(0xF4, 0xC7, 0xD9);
    private static final Color ACCENT_BLUE = new Color(0x55, 0x77, 0xB9);
    private static final Color TEXT_DARK = new Color(0x1F, 0x29, 0x37);
    private static final Color TEXT_MUTED = new Color(0x6B, 0x72, 0x80);
    private static final Color BG_LIGHT = new Color(0xF5, 0xF9, 0xFF);

    public PdfService(QrCodeService qrCodeService) {
        this.qrCodeService = qrCodeService;
    }

    public byte[] generateCertificatePdf(Certificate cert) {
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            Document document = new Document(PageSize.A4.rotate(), 36, 36, 36, 36);
            PdfWriter.getInstance(document, baos);
            document.open();

            // Background table / ornate card
            PdfPTable card = new PdfPTable(1);
            card.setWidthPercentage(100);

            PdfPCell mainCell = new PdfPCell();
            mainCell.setBackgroundColor(BG_LIGHT);
            mainCell.setBorderColor(ACCENT_BLUE);
            mainCell.setBorderWidth(4f);
            mainCell.setPadding(28f);

            // Inner Table for content
            PdfPTable content = new PdfPTable(1);
            content.setWidthPercentage(100);

            // 1. Issuing Organisation / Header
            Font orgFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14, ACCENT_BLUE);
            Paragraph orgPara = new Paragraph(cert.getOrganisation().toUpperCase(), orgFont);
            orgPara.setAlignment(Element.ALIGN_CENTER);
            content.addCell(createBorderlessCell(orgPara));

            // Title
            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 26, ACCENT_BLUE);
            Paragraph titlePara = new Paragraph("CERTIFICATE OF COMPLETION", titleFont);
            titlePara.setAlignment(Element.ALIGN_CENTER);
            titlePara.setSpacingBefore(10f);
            titlePara.setSpacingAfter(8f);
            content.addCell(createBorderlessCell(titlePara));

            // Subtitle
            Font subFont = FontFactory.getFont(FontFactory.HELVETICA_OBLIQUE, 12, TEXT_MUTED);
            Paragraph subPara = new Paragraph("This is proudly presented in recognition of the successful completion to", subFont);
            subPara.setAlignment(Element.ALIGN_CENTER);
            subPara.setSpacingAfter(12f);
            content.addCell(createBorderlessCell(subPara));

            // Student Name
            Font studentFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 24, TEXT_DARK);
            Paragraph studentPara = new Paragraph(cert.getStudentName(), studentFont);
            studentPara.setAlignment(Element.ALIGN_CENTER);
            studentPara.setSpacingAfter(12f);
            content.addCell(createBorderlessCell(studentPara));

            // For completing course
            Font forFont = FontFactory.getFont(FontFactory.HELVETICA, 12, TEXT_MUTED);
            Paragraph forPara = new Paragraph("for having fulfilled all academic & project requirements for the certified program", forFont);
            forPara.setAlignment(Element.ALIGN_CENTER);
            content.addCell(createBorderlessCell(forPara));

            // Course Name
            Font courseFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18, ACCENT_BLUE);
            Paragraph coursePara = new Paragraph(cert.getCourseName(), courseFont);
            coursePara.setAlignment(Element.ALIGN_CENTER);
            coursePara.setSpacingBefore(5f);
            coursePara.setSpacingAfter(18f);
            content.addCell(createBorderlessCell(coursePara));

            // Bottom 3-column table: Left (Details), Middle (Verification Seal & QR), Right (Signature)
            PdfPTable footerTable = new PdfPTable(3);
            footerTable.setWidthPercentage(100);
            footerTable.setWidths(new float[]{35f, 30f, 35f});

            // Left: Details
            Font detailFont = FontFactory.getFont(FontFactory.HELVETICA, 9, TEXT_DARK);
            Font boldDetailFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 9, ACCENT_BLUE);
            Paragraph details = new Paragraph();
            details.add(new Chunk("Certificate ID: ", boldDetailFont));
            details.add(new Chunk(cert.getCertificateId() + "\n", detailFont));
            details.add(new Chunk("Issue Date: ", boldDetailFont));
            details.add(new Chunk(cert.getIssueDate().toString() + "\n", detailFont));
            if (cert.getExpiryDate() != null) {
                details.add(new Chunk("Expiry Date: ", boldDetailFont));
                details.add(new Chunk(cert.getExpiryDate().toString() + "\n", detailFont));
            }
            if (cert.getGrade() != null && !cert.getGrade().isBlank()) {
                details.add(new Chunk("Distinction / Grade: ", boldDetailFont));
                details.add(new Chunk(cert.getGrade() + "\n", detailFont));
            }
            PdfPCell leftCell = new PdfPCell(details);
            leftCell.setBorder(Rectangle.NO_BORDER);
            leftCell.setVerticalAlignment(Element.ALIGN_BOTTOM);
            footerTable.addCell(leftCell);

            // Middle: QR Code
            byte[] qrBytes = qrCodeService.generateQrCodeBytes(qrCodeService.getVerificationUrl(cert.getCertificateId()), 120, 120);
            Image qrImage = Image.getInstance(qrBytes);
            qrImage.scaleToFit(85, 85);
            qrImage.setAlignment(Element.ALIGN_CENTER);

            PdfPCell middleCell = new PdfPCell();
            middleCell.setBorder(Rectangle.NO_BORDER);
            middleCell.setHorizontalAlignment(Element.ALIGN_CENTER);
            middleCell.addElement(qrImage);
            Font scanFont = FontFactory.getFont(FontFactory.HELVETICA, 7, ACCENT_BLUE);
            Paragraph scanPara = new Paragraph("Scan to verify online", scanFont);
            scanPara.setAlignment(Element.ALIGN_CENTER);
            middleCell.addElement(scanPara);
            footerTable.addCell(middleCell);

            // Right: Authority Sign
            PdfPCell rightCell = new PdfPCell();
            rightCell.setBorder(Rectangle.NO_BORDER);
            rightCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
            rightCell.setVerticalAlignment(Element.ALIGN_BOTTOM);

            Paragraph signLine = new Paragraph("_________________________\nAuthorized Signatory\n" + cert.getOrganisation(),
                    FontFactory.getFont(FontFactory.HELVETICA, 9, TEXT_MUTED));
            signLine.setAlignment(Element.ALIGN_RIGHT);
            rightCell.addElement(signLine);
            footerTable.addCell(rightCell);

            content.addCell(createBorderlessCell(footerTable));
            mainCell.addElement(content);
            card.addCell(mainCell);
            document.add(card);

            document.close();
            return baos.toByteArray();
        } catch (Exception e) {
            logger.error("Failed to generate certificate PDF for: {}", cert.getCertificateId(), e);
            throw new RuntimeException("PDF generation error: " + e.getMessage(), e);
        }
    }

    public byte[] generateVerificationReportPdf(Certificate cert, String hash, long count) {
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            Document document = new Document(PageSize.A4, 40, 40, 40, 40);
            PdfWriter.getInstance(document, baos);
            document.open();

            // Header Banner
            PdfPTable header = new PdfPTable(1);
            header.setWidthPercentage(100);
            PdfPCell headerCell = new PdfPCell();
            headerCell.setBackgroundColor(ACCENT_BLUE);
            headerCell.setPadding(16f);

            Font brandFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18, Color.WHITE);
            Paragraph brandPara = new Paragraph("CertiVerify Cloud Verification System", brandFont);
            brandPara.setAlignment(Element.ALIGN_CENTER);
            headerCell.addElement(brandPara);

            Font docTitleFont = FontFactory.getFont(FontFactory.HELVETICA, 11, BG_LIGHT);
            Paragraph docTitle = new Paragraph("OFFICIAL DIGITAL VERIFICATION AUDIT TRANSCRIPT", docTitleFont);
            docTitle.setAlignment(Element.ALIGN_CENTER);
            headerCell.addElement(docTitle);
            header.addCell(headerCell);
            document.add(header);

            document.add(new Paragraph(" "));

            // Status Banner
            boolean isVerified = cert.getStatus() == CertificateStatus.VERIFIED && !cert.isExpired();
            Color statusBg = isVerified ? new Color(0xDC, 0xF8, 0xE6) : (cert.getStatus() == CertificateStatus.REVOKED ? new Color(0xFD, 0xDD, 0xDE) : new Color(0xFE, 0xF3, 0xC7));
            Color statusFg = isVerified ? new Color(0x06, 0x5F, 0x46) : (cert.getStatus() == CertificateStatus.REVOKED ? new Color(0x99, 0x1B, 0x1B) : new Color(0x92, 0x40, 0x0E));

            PdfPTable statusTable = new PdfPTable(1);
            statusTable.setWidthPercentage(100);
            PdfPCell statusCell = new PdfPCell();
            statusCell.setBackgroundColor(statusBg);
            statusCell.setPadding(14f);
            statusCell.setBorderColor(statusFg);

            Font statusFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14, statusFg);
            Paragraph sp = new Paragraph("VERIFICATION STATUS: " + (cert.isExpired() ? "EXPIRED" : cert.getStatus().name()), statusFont);
            sp.setAlignment(Element.ALIGN_CENTER);
            statusCell.addElement(sp);

            Font statusSubFont = FontFactory.getFont(FontFactory.HELVETICA, 10, statusFg);
            String desc = isVerified
                    ? "This digital credential is authenticated, active, and securely registered in the cloud database."
                    : (cert.getStatus() == CertificateStatus.REVOKED
                        ? "WARNING: This certificate has been revoked. Reason: " + (cert.getRevocationReason() != null ? cert.getRevocationReason() : "Administrative action")
                        : "NOTICE: This certificate has expired on " + cert.getExpiryDate());
            Paragraph sSub = new Paragraph(desc, statusSubFont);
            sSub.setAlignment(Element.ALIGN_CENTER);
            statusCell.addElement(sSub);
            statusTable.addCell(statusCell);
            document.add(statusTable);

            document.add(new Paragraph(" "));

            // Record Details Table
            PdfPTable detailsTable = new PdfPTable(2);
            detailsTable.setWidthPercentage(100);
            detailsTable.setWidths(new float[]{35f, 65f});

            addTableRow(detailsTable, "Certificate ID", cert.getCertificateId());
            addTableRow(detailsTable, "Student / Recipient Name", cert.getStudentName());
            addTableRow(detailsTable, "Course / Program Name", cert.getCourseName());
            addTableRow(detailsTable, "Issuing Organisation", cert.getOrganisation());
            addTableRow(detailsTable, "Issue Date", cert.getIssueDate().toString());
            addTableRow(detailsTable, "Expiry Date", cert.getExpiryDate() != null ? cert.getExpiryDate().toString() : "No Expiry (Lifetime)");
            addTableRow(detailsTable, "Grade / Distinction", cert.getGrade() != null ? cert.getGrade() : "Passed");
            addTableRow(detailsTable, "Digital SHA-256 Fingerprint", hash != null ? hash : "SHA256:VERIFIED-AUTH-CHECKSUM");
            addTableRow(detailsTable, "Audit Timestamp", LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
            addTableRow(detailsTable, "Total Verification Requests", String.valueOf(count));
            document.add(detailsTable);

            document.add(new Paragraph(" "));

            // QR Code & Seal Section
            byte[] qrBytes = qrCodeService.generateQrCodeBytes(qrCodeService.getVerificationUrl(cert.getCertificateId()), 130, 130);
            Image qrImage = Image.getInstance(qrBytes);
            qrImage.scaleToFit(90, 90);
            qrImage.setAlignment(Element.ALIGN_CENTER);
            document.add(qrImage);

            Paragraph footerPara = new Paragraph(
                    "CertiVerify Cloud Verification Authority • Encrypted Cloud Storage & Verification • Powered by AWS S3 & PostgreSQL\nDirect Verification URL: " + qrCodeService.getVerificationUrl(cert.getCertificateId()),
                    FontFactory.getFont(FontFactory.HELVETICA, 8, TEXT_MUTED));
            footerPara.setAlignment(Element.ALIGN_CENTER);
            footerPara.setSpacingBefore(10f);
            document.add(footerPara);

            document.close();
            return baos.toByteArray();
        } catch (Exception e) {
            logger.error("Failed to generate verification report for: {}", cert.getCertificateId(), e);
            throw new RuntimeException("Report generation error: " + e.getMessage(), e);
        }
    }

    private void addTableRow(PdfPTable table, String key, String value) {
        Font kFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 9, ACCENT_BLUE);
        Font vFont = FontFactory.getFont(FontFactory.HELVETICA, 9, TEXT_DARK);

        PdfPCell c1 = new PdfPCell(new Phrase(key, kFont));
        c1.setBackgroundColor(BG_LIGHT);
        c1.setPadding(6f);

        PdfPCell c2 = new PdfPCell(new Phrase(value, vFont));
        c2.setPadding(6f);

        table.addCell(c1);
        table.addCell(c2);
    }

    private PdfPCell createBorderlessCell(Element element) {
        PdfPCell cell = new PdfPCell();
        cell.setBorder(Rectangle.NO_BORDER);
        cell.addElement(element);
        return cell;
    }
}
