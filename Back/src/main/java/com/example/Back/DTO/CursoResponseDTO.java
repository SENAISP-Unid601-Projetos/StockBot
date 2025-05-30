// CursoResponseDTO.java
package com.example.Back.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CursoResponseDTO {
    private Long idCurso;
    private String codigo;
    private String nome;
    private float cargaHoraria;
    private LocalDate dataInicio;
    private LocalDate dataTermino;
}