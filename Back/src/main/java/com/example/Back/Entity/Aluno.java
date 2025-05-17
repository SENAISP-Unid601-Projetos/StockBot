package com.example.Back.Entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "aluno")
public class Aluno extends Usuario {
    @NotNull
    @OneToOne(mappedBy = "aluno", cascade = CascadeType.ALL)
    private Matricula matricula;
    @NotNull
    @Column(name = "data_ingresso", nullable = false)
    private Date data_ingresso;
    @Column(name = "data_evasao")
    private Date data_evasao;
}
