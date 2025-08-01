package com.example.Back.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProfessorCursoResponseDTO {
    private Long id;
    private String nomeProfessor;
    private String nomeCurso;
    private String disciplina;
    private String periodo;
}
