package com.example.Back.Entity;

import jakarta.persistence.*;
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
    @OneToOne(mappedBy = "aluno", cascade = CascadeType.ALL)
    @Column(name = "matricula", nullable = false, length = 20)
    private Matricula matricula;
    @Column(name = "data_ingresso", nullable = false)
    private Date data_ingresso;
    @Column(name = "data_evasao")
    private Date data_evasao;
}
