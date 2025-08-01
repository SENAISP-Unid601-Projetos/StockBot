package com.example.Back.DTO;

import lombok.Data;

@Data
public class ConfiguracaoResponseDTO {
    private Long id;
    private String chave;
    private String valor;
    private String descricao;
}