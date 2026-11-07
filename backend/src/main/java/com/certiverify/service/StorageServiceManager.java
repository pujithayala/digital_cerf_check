package com.certiverify.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Primary
@Service
public class StorageServiceManager implements StorageService {

    private static final Logger logger = LoggerFactory.getLogger(StorageServiceManager.class);

    private final LocalStorageService localStorageService;
    private final AwsS3StorageService awsS3StorageService;

    @Autowired
    public StorageServiceManager(LocalStorageService localStorageService, AwsS3StorageService awsS3StorageService) {
        this.localStorageService = localStorageService;
        this.awsS3StorageService = awsS3StorageService;
    }

    private StorageService getActiveService() {
        if (awsS3StorageService.isReady()) {
            return awsS3StorageService;
        }
        return localStorageService;
    }

    @Override
    public String storeFile(byte[] content, String fileName, String contentType) throws IOException {
        return getActiveService().storeFile(content, fileName, contentType);
    }

    @Override
    public byte[] loadFile(String fileKey) throws IOException {
        try {
            return getActiveService().loadFile(fileKey);
        } catch (Exception e) {
            // Fallback to local if S3 fails or vice versa
            return localStorageService.loadFile(fileKey);
        }
    }

    @Override
    public String getFileUrl(String fileKey) {
        return getActiveService().getFileUrl(fileKey);
    }

    @Override
    public boolean deleteFile(String fileKey) {
        return getActiveService().deleteFile(fileKey);
    }

    @Override
    public String getStorageType() {
        return getActiveService().getStorageType();
    }
}
