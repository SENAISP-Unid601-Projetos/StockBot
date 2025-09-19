package com.example.Back.Entity;

import lombok.Getter;

@Getter // Adiciona o getter automaticamente com Lombok, resolvendo o aviso
public enum UserRole {
    ADMIN("admin"),
    USER("user");

    // Torna o campo final (imutável), que é uma boa prática para Enums
    private final String role;

    UserRole(String role) {
        this.role = role;
    }
}