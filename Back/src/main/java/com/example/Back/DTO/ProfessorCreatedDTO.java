package com.example.Back.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProfessorCreatedDTO {
    private String cpf;
    private String titulacao;
    private String area_especializacao;
    private Date data_nascimento;
}
