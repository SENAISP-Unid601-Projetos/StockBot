package com.example.Back.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AlunoDTO {
    private Long id;
    private String matricula;
    private Date data_ingresso;
    private Date data_evasao;
}
