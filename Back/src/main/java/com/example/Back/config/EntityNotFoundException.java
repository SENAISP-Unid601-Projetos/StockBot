// EntityNotFoundException.java
package com.example.Back.config;

public class EntityNotFoundException extends RuntimeException {
    public EntityNotFoundException(String message) {
        super(message);
    }
}
