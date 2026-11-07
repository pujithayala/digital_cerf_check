package com.certiverify.service;

import java.io.IOException;

public interface StorageService {
    String storeFile(byte[] content, String fileName, String contentType) throws IOException;
    byte[] loadFile(String fileKey) throws IOException;
    String getFileUrl(String fileKey);
    boolean deleteFile(String fileKey);
    String getStorageType();
}
