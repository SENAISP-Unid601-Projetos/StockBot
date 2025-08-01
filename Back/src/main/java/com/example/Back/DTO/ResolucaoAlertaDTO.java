// src/main/java/com/example/Back/DTO/ResolucaoAlertaDTO.java
package com.example.Back.DTO;

import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ResolucaoAlertaDTO {
    @Size(max = 500, message = "Comentário deve ter no máximo 500 caracteres")
    private String comentarioResolucao;
}