package com.example.Back.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AlunoCreatedDTO {
    private String matricula;
    private Date data_ingresso;
    private Date data_evasao;
    private Integer cursoId;
    private String status;
}