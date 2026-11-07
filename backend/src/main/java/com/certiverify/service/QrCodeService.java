package com.certiverify.service;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.google.zxing.qrcode.decoder.ErrorCorrectionLevel;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.util.HashMap;
import java.util.Map;

@Service
public class QrCodeService {

    private static final Logger logger = LoggerFactory.getLogger(QrCodeService.class);

    private final StorageService storageService;
    private final String frontendUrl;

    public QrCodeService(
            StorageService storageService,
            @Value("${app.frontend-url:http://localhost:5173}") String frontendUrl) {
        this.storageService = storageService;
        this.frontendUrl = frontendUrl.endsWith("/") ? frontendUrl.substring(0, frontendUrl.length() - 1) : frontendUrl;
    }

    public byte[] generateQrCodeBytes(String text, int width, int height) {
        try {
            QRCodeWriter qrCodeWriter = new QRCodeWriter();
            Map<EncodeHintType, Object> hints = new HashMap<>();
            hints.put(EncodeHintType.CHARACTER_SET, "UTF-8");
            hints.put(EncodeHintType.ERROR_CORRECTION, ErrorCorrectionLevel.H);
            hints.put(EncodeHintType.MARGIN, 1);

            BitMatrix bitMatrix = qrCodeWriter.encode(text, BarcodeFormat.QR_CODE, width, height, hints);
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            MatrixToImageWriter.writeToStream(bitMatrix, "PNG", outputStream);
            return outputStream.toByteArray();
        } catch (Exception e) {
            logger.error("Failed to generate QR code for text: {}", text, e);
            throw new RuntimeException("Error generating QR code", e);
        }
    }

    public String generateAndStoreCertificateQr(String certificateId) {
        String verificationUrl = frontendUrl + "/verify/" + certificateId;
        byte[] qrBytes = generateQrCodeBytes(verificationUrl, 350, 350);
        String fileName = "qrcodes/qr-" + certificateId + ".png";

        try {
            String storedKey = storageService.storeFile(qrBytes, fileName, "image/png");
            return storageService.getFileUrl(storedKey);
        } catch (Exception e) {
            logger.error("Could not save QR code for certificate: {}", certificateId, e);
            // Return data URI as fallback
            return "data:image/png;base64," + java.util.Base64.getEncoder().encodeToString(qrBytes);
        }
    }

    public String getVerificationUrl(String certificateId) {
        return frontendUrl + "/verify/" + certificateId;
    }
}
