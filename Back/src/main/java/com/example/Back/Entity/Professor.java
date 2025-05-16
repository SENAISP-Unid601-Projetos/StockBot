package com.example.Back.Entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "professor")
public class Professor extends Usuario{
    @Column(name = "cpf", nullable = false, unique = true, length = 11)
    private String cpf;
    @Column(name = "titulacao")
    private String titulacao;
    @Column(name = "area_especializacao")
    private String area_especializacao;
    @Column(name = "data_nascimento")
    private Date data_nascimento;
}
