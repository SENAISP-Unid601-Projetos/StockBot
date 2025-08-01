package com.example.Back.DTO;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ConfiguracaoUpdateDTO {
    @NotBlank(message = "Valor é obrigatório")
    private String valor;

    private String descricao;
}