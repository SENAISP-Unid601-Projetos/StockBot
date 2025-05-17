package com.example.Back.Entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.util.Date;

@EqualsAndHashCode(callSuper = true)
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "professor")
public class Professor extends Usuario{
    @NotBlank
    @Column(name = "cpf", nullable = false, unique = true, length = 11)
    private String cpf;
    @NotBlank
    @Column(name = "titulacao")
    private String titulacao;
    @NotBlank
    @Column(name = "area_especializacao")
    private String area_especializacao;
    @Column(name = "data_nascimento")
    private Date data_nascimento;
}
