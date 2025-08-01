package com.example.Back.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Date;

public record AlunoCreatedDTO (
    String nome,
    String email,
    String senha,
    Date data_ingresso,
    Date data_evasao,
    Integer cursoId,
    String status
) {
}