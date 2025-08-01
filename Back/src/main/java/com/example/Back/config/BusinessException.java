// src/main/java/com/example/Back/config/BusinessException.java
package com.example.Back.config;

public class BusinessException extends RuntimeException {
    public BusinessException(String message) {
        super(message);
    }
}