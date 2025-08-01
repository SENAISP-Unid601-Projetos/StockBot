package com.example.Back.DTO;

import com.example.Back.Entity.Usuario.TipoUsuario;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AtualizacaoTipoUsuarioDTO {
    @NotNull(message = "Novo tipo é obrigatório")
    private TipoUsuario novoTipo;
}