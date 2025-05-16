package com.example.Back.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProfessorCursoCreatedDTO {
    private Long professorId;
    private Long cursoId;
    private String disciplina;
    private String periodo;
}
