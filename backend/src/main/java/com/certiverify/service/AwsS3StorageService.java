package com.certiverify.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.core.ResponseBytes;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.*;

import java.io.IOException;

@Service("awsS3StorageService")
public class AwsS3StorageService implements StorageService {

    private static final Logger logger = LoggerFactory.getLogger(AwsS3StorageService.class);

    private final String bucketName;
    private final String region;
    private final S3Client s3Client;
    private final boolean ready;

    public AwsS3StorageService(
            @Value("${aws.s3.bucket:}") String bucketName,
            @Value("${aws.region:us-east-1}") String region,
            @Value("${aws.access-key:}") String accessKey,
            @Value("${aws.secret-key:}") String secretKey) {
        
        this.bucketName = bucketName;
        this.region = region;

        if (bucketName != null && !bucketName.isBlank() && accessKey != null && !accessKey.isBlank() && secretKey != null && !secretKey.isBlank()) {
            try {
                this.s3Client = S3Client.builder()
                        .region(Region.of(region))
                        .credentialsProvider(StaticCredentialsProvider.create(
                                AwsBasicCredentials.create(accessKey, secretKey)
                        ))
                        .build();
                this.ready = true;
                logger.info("AWS S3 Storage initialized successfully for bucket: {} in region: {}", bucketName, region);
            } catch (Exception e) {
                logger.warn("AWS S3 credentials provided but S3Client initialization failed: {}", e.getMessage());
                throw e;
            }
        } else {
            this.s3Client = null;
            this.ready = false;
            logger.info("AWS S3 is not fully configured (bucket/credentials omitted). Local storage fallback active.");
        }
    }

    public boolean isReady() {
        return ready && s3Client != null;
    }

    @Override
    public String storeFile(byte[] content, String fileName, String contentType) throws IOException {
        if (!isReady()) {
            throw new IOException("AWS S3 is not configured.");
        }
        try {
            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(fileName)
                    .contentType(contentType != null ? contentType : "application/octet-stream")
                    .build();

            s3Client.putObject(putObjectRequest, RequestBody.fromBytes(content));
            logger.info("File uploaded to AWS S3: s3://{}/{}", bucketName, fileName);
            return fileName;
        } catch (Exception e) {
            logger.error("Failed to upload file to S3: {}", fileName, e);
            throw new IOException("AWS S3 upload error: " + e.getMessage(), e);
        }
    }

    @Override
    public byte[] loadFile(String fileKey) throws IOException {
        if (!isReady()) {
            throw new IOException("AWS S3 is not configured.");
        }
        try {
            GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                    .bucket(bucketName)
                    .key(fileKey)
                    .build();

            ResponseBytes<GetObjectResponse> responseBytes = s3Client.getObjectAsBytes(getObjectRequest);
            return responseBytes.asByteArray();
        } catch (Exception e) {
            throw new IOException("Failed to load file from AWS S3: " + fileKey, e);
        }
    }

    @Override
    public String getFileUrl(String fileKey) {
        if (fileKey == null || fileKey.isBlank()) {
            return null;
        }
        if (fileKey.startsWith("http://") || fileKey.startsWith("https://")) {
            return fileKey;
        }
        return String.format("https://%s.s3.%s.amazonaws.com/%s", bucketName, region, fileKey);
    }

    @Override
    public boolean deleteFile(String fileKey) {
        if (!isReady()) {
            return false;
        }
        try {
            DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder()
                    .bucket(bucketName)
                    .key(fileKey)
                    .build();
            s3Client.deleteObject(deleteObjectRequest);
            return true;
        } catch (Exception e) {
            logger.warn("Could not delete S3 object: {}", fileKey, e);
            return false;
        }
    }

    @Override
    public String getStorageType() {
        return "AWS_S3";
    }
}
