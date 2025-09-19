package com.example.Back.Dto;

import jakarta.validation.constraints.NotBlank;

public record AuthDTO(
        @NotBlank(message = "O e-mail não pode estar em branco")
        String email,
        @NotBlank(message = "A senha não pode estar em branco")
        String senha) {
}
