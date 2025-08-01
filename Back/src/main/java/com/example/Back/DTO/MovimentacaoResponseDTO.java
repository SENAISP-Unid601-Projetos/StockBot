package com.example.Back.DTO;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class MovimentacaoResponseDTO {
    private Long id;
    private String tipo;
    private String materialCodigo;
    private String materialNome;
    private Integer quantidade;
    private Integer novoSaldo;
    private LocalDateTime dataHora;
    private String observacoes;
    private String usuarioResponsavel;
}
