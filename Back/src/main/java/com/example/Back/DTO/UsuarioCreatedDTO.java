package com.example.Back.DTO;

import com.example.Back.Entity.UserType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioCreatedDTO {
    private String nome;
    private String email;
    private UserType tipo;
}
