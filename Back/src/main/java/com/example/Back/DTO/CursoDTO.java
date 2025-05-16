package com.example.Back.DTO;

import lombok.Data;

import java.time.LocalDate;

@Data
public class CursoDTO {
    private Long idCurso;
    private String codigo;
    private String nome;
    private float cargaHoraria;
    private LocalDate dataInicio;
    private LocalDate dataTermino;

}
