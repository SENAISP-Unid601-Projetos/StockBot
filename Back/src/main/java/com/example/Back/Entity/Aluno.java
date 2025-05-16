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
    @Column(nullable = false, length = 20)
    private Matricula matricula;
    @Column(nullable = false)
    private Date data_ingresso;
    private Date data_evasao;

}
