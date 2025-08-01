package com.example.Back.DTO;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ConfiguracaoCreateDTO {
    @NotBlank(message = "Chave é obrigatória")
    private String chave;

    @NotBlank(message = "Valor é obrigatório")
    private String valor;

    private String descricao;
}
