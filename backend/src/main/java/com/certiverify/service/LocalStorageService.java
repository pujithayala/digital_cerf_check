package com.certiverify.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service("localStorageService")
public class LocalStorageService implements StorageService {

    private static final Logger logger = LoggerFactory.getLogger(LocalStorageService.class);

    private final Path rootLocation;
    private final String baseUrl;

    public LocalStorageService(
            @Value("${app.storage.local-dir:./uploads}") String uploadDir,
            @Value("${server.port:8080}") int serverPort) {
        this.rootLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
        this.baseUrl = "http://localhost:" + serverPort + "/api/files/";

        try {
            Files.createDirectories(this.rootLocation.resolve("certificates"));
            Files.createDirectories(this.rootLocation.resolve("qrcodes"));
            Files.createDirectories(this.rootLocation.resolve("reports"));
            logger.info("Local storage initialized at: {}", this.rootLocation);
        } catch (IOException e) {
            logger.error("Could not initialize local storage folder", e);
        }
    }

    @Override
    public String storeFile(byte[] content, String fileName, String contentType) throws IOException {
        String cleanFileName = Paths.get(fileName).getFileName().toString();
        Path targetLocation = this.rootLocation.resolve(cleanFileName);
        
        Files.createDirectories(targetLocation.getParent());
        Files.write(targetLocation, content);

        logger.info("Saved file locally: {}", cleanFileName);
        return cleanFileName;
    }

    @Override
    public byte[] loadFile(String fileKey) throws IOException {
        Path filePath = this.rootLocation.resolve(fileKey).normalize();
        if (!Files.exists(filePath)) {
            throw new IOException("File not found: " + fileKey);
        }
        return Files.readAllBytes(filePath);
    }

    @Override
    public String getFileUrl(String fileKey) {
        if (fileKey == null || fileKey.isBlank()) {
            return null;
        }
        if (fileKey.startsWith("http://") || fileKey.startsWith("https://")) {
            return fileKey;
        }
        return baseUrl + fileKey;
    }

    @Override
    public boolean deleteFile(String fileKey) {
        try {
            Path filePath = this.rootLocation.resolve(fileKey).normalize();
            return Files.deleteIfExists(filePath);
        } catch (IOException e) {
            logger.warn("Could not delete file: {}", fileKey, e);
            return false;
        }
    }

    @Override
    public String getStorageType() {
        return "LOCAL_DISK";
    }
}
