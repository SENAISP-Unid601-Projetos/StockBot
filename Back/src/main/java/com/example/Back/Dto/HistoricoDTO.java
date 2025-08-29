package com.example.Back.Dto;

import com.example.Back.Entity.TipoMovimentacao;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HistoricoDTO {

    private Long id;
    private String codigoMovimentacao;
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS")
    private LocalDateTime dataHora;
    private TipoMovimentacao tipo;
    private Long componenteId; // Usamos apenas o ID do componente
    private int quantidade;
    private String usuario;
}