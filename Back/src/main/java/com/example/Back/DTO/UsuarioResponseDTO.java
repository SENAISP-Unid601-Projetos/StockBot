package com.example.Back.DTO;

import com.example.Back.Entity.Usuario.TipoUsuario;
import lombok.Data;

@Data
public class UsuarioResponseDTO {
    private Long id;
    private String nome;
    private String email;
    private TipoUsuario tipo;
}