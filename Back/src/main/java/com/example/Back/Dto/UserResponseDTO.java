package com.example.Back.Dto;

import com.example.Back.Entity.UserRole;
import com.example.Back.Entity.Usuario;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserResponseDTO {
    private Long id;
    private String email;
    private UserRole role;

    // Construtor para facilitar a conversão da Entidade para DTO
    public UserResponseDTO(Usuario usuario) {
        this.id = usuario.getId();
        this.email = usuario.getEmail();
        this.role = usuario.getRole();
    }
}
