package com.certiverify.controller;

import com.certiverify.service.StorageService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.HandlerMapping;

import java.io.IOException;

@RestController
@RequestMapping("/api/files")
public class FileController {

    private final StorageService storageService;

    @Autowired
    public FileController(StorageService storageService) {
        this.storageService = storageService;
    }

    @GetMapping("/**")
    public ResponseEntity<byte[]> getFile(HttpServletRequest request) {
        String path = (String) request.getAttribute(HandlerMapping.PATH_WITHIN_HANDLER_MAPPING_ATTRIBUTE);
        String bestMatchingPattern = (String) request.getAttribute(HandlerMapping.BEST_MATCHING_PATTERN_ATTRIBUTE);
        String fileKey = path.substring("/api/files/".length());

        try {
            byte[] data = storageService.loadFile(fileKey);
            MediaType mediaType = MediaType.APPLICATION_OCTET_STREAM;
            if (fileKey.endsWith(".pdf")) {
                mediaType = MediaType.APPLICATION_PDF;
            } else if (fileKey.endsWith(".png")) {
                mediaType = MediaType.IMAGE_PNG;
            } else if (fileKey.endsWith(".jpg") || fileKey.endsWith(".jpeg")) {
                mediaType = MediaType.IMAGE_JPEG;
            }

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_TYPE, mediaType.toString())
                    .header(HttpHeaders.CACHE_CONTROL, "public, max-age=86400")
                    .body(data);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}

