// CursoCreateDTO.java
package com.example.Back.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CursoCreateDTO {
    @NotBlank(message = "Código é obrigatório")
    private String codigo;

    @NotBlank(message = "Nome é obrigatório")
    private String nome;

    @NotNull(message = "Carga horária é obrigatória")
    private float cargaHoraria;

    @NotNull(message = "Data de início é obrigatória")
    private LocalDate dataInicio;

    private LocalDate dataTermino;
}