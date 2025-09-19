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

// A ORDEM DOS CAMPOS AGORA CORRESPONDE À CHAMADA NO SERVICE

    private Long id;
    private Long componenteId;
    private String componenteNome;
    private TipoMovimentacao tipo;
    private int quantidade;
    private String usuario;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime dataHora;

    private String codigoMovimentacao;


}