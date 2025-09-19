package com.example.Back.Dto;

import com.example.Back.Entity.UserRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record RegisterDTO(
        @NotBlank @Email String email,
        @NotBlank @Size(min = 6) String senha,
        @NotNull UserRole role
) {}