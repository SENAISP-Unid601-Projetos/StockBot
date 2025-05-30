package com.example.Back.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;



@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProfessorCursoCreatedDTO {
    @NotNull(message = "O ID do professor é obrigatório")
    private Long professorId;

    @NotNull(message = "O ID do curso é obrigatório")
    private Long cursoId;

    @NotBlank(message = "A disciplina não pode ser vazia")
    private String disciplina;

    @NotBlank(message = "O período não pode ser vazio")
    private String periodo;
}