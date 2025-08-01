// src/main/java/com/example/Back/DTO/AlertaDTO.java
package com.example.Back.DTO;

import com.example.Back.Entity.Alerta.AlertaStatus;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class AlertaDTO {
    private Long id;
    private String titulo;
    private String mensagem;
    private String comentarioResolucao;
    private Long usuarioResolucaoId;
    private String usuarioResolucaoNome;
    private AlertaStatus status;
    private LocalDateTime dataCriacao;
    private LocalDateTime dataResolucao;
    private Long usuarioResponsavelId;
    private String usuarioResponsavelNome;
}