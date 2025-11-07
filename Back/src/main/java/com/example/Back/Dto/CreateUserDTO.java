package com.example.Back.Dto;

import com.example.Back.Entity.UserRole; // <-- 1. Importar UserRole
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull; // <-- 2. Importar NotNull
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CreateUserDTO {
    @NotBlank(message = "O e-mail é obrigatório")
    @Email(message = "Formato de e-mail inválido")
    private String email;

    @NotBlank(message = "A senha é obrigatória")
    @Size(min = 6, message = "A senha deve ter no mínimo 6 caracteres")
    private String senha;

    // 3. Adicionar o campo 'role'
    @NotNull(message = "O cargo (role) é obrigatório")
    private UserRole role;

}