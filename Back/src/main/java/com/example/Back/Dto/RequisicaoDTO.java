package com.example.Back.Dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RequisicaoDTO {
    private Long id;
    private String componenteNome;
    private Integer quantidade;
    private String justificativa;
    private String solicitanteEmail;

    @JsonFormat(pattern = "dd/MM/yyyy HH:mm") // Formato brasileiro amigável
    private LocalDateTime dataRequisicao;
}